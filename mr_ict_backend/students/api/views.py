from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional

from django.db.models import Count, Prefetch, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from analytics.models import LearningEvent
from analytics.services import record_event
from courses.models import (
    CodingChallenge,
    Course,
    Lesson,
    LessonAssignment,
    LessonCodeSnippet,
    LessonInsertOutput,
    LessonInsertVideo,
    LessonVideo,
    Module,
    PublishStatus,
)
from students.api.serializers import (
    CourseCatalogSerializer,
    CourseDetailSerializer,
    LessonAssetSerializer,
    LessonPlaybackSerializer,
    StudentProfileSerializer,
    build_resume_map,
)
from students.models import Student, StudentBadge, StudentChallenge, StudentCourse, StudentLesson


class StudentExperienceBaseView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_student(self, request) -> Student:
        user = request.user
        if not hasattr(user, "student"):
            raise Http404("Student profile not found")
        return user.student

    def absolute_url(self, request, maybe_field) -> Optional[str]:
        if not maybe_field:
            return None
        try:
            url = maybe_field.url
        except AttributeError:
            url = str(maybe_field)
        return request.build_absolute_uri(url)


class StudentProfileView(StudentExperienceBaseView):
    def get(self, request):
        student = self.get_student(request)
        serializer = StudentProfileSerializer(student, context={"request": request})
        return Response({"message": "Successful", "data": serializer.data})

    def patch(self, request):
        student = self.get_student(request)
        serializer = StudentProfileSerializer(
            student,
            data=request.data,
            partial=True,
            context={
                "request": request,
                "mark_onboarding_complete": request.data.get("complete_onboarding", True),
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Successful", "data": serializer.data})


class StudentDashboardView(StudentExperienceBaseView):
    def get(self, request):
        student = self.get_student(request)
        user = request.user

        student_courses = (
            StudentCourse.objects.filter(student=student)
            .select_related("course")
            .prefetch_related(
                Prefetch(
                    "course_lesson",
                    queryset=StudentLesson.objects.select_related("lesson", "lesson__course")
                    .order_by("-updated_at"),
                )
            )
        )
        enrollments = {item.course.course_id: item for item in student_courses}
        resume_map = build_resume_map(student_courses)

        course_overview = {
            "in_progress": student_courses.filter(completed=False).count(),
            "completed": student_courses.filter(completed=True).count(),
            "challenges_completed": StudentChallenge.objects.filter(student=student, completed=True).count(),
            "xp": student.epz,
        }

        unread_notifications = getattr(user, "notifications", None)
        notifications_count = unread_notifications.filter(read=False).count() if unread_notifications else 0
        student_messages = getattr(user, "student_messages", None)
        messages_count = student_messages.filter(read=False).count() if student_messages else 0

        resume_learning_payload: List[Dict[str, Any]] = []
        for student_course in student_courses:
            for student_lesson in student_course.course_lesson.all():
                if student_lesson.completed:
                    continue
                lesson = student_lesson.lesson
                resume_learning_payload.append(
                    {
                        "student_lesson_id": student_lesson.pk,
                        "lesson_id": lesson.lesson_id,
                        "lesson_title": lesson.title,
                        "course_id": student_course.course.course_id,
                        "course_title": student_course.course.title,
                        "lessons_completed": student_course.lessons_completed,
                        "total_lessons": student_course.total_lessons,
                        "progress_percent": float(student_course.progress_percent or 0),
                        "thumbnail": self.absolute_url(request, getattr(lesson, "thumbnail", None)),
                        "updated_at": student_lesson.updated_at,
                    }
                )
        resume_learning_payload.sort(key=lambda item: item["updated_at"], reverse=True)
        resume_learning_payload = resume_learning_payload[:5]

        published_courses = Course.objects.filter(
            status=PublishStatus.PUBLISHED,
            is_archived=False,
        ).annotate(
            modules_count=Count("modules", filter=Q(modules__status=PublishStatus.PUBLISHED), distinct=True),
            lessons_count=Count("lessons", filter=Q(lessons__status=PublishStatus.PUBLISHED), distinct=True),
        )

        recommended_courses = [
            course
            for course in published_courses
            if course.course_id not in enrollments
        ][:6]

        def serialize_course(course: Course) -> Dict[str, Any]:
            serializer = CourseCatalogSerializer(
                course,
                context={
                    "request": request,
                    "enrollments": enrollments,
                    "resume_map": resume_map,
                },
            )
            return serializer.data

        badges_payload = [
            {
                "id": badge.pk,
                "name": badge.badge.badge_name if badge.badge else None,
                "criteria": badge.badge.criteria if badge.badge else None,
                "image": self.absolute_url(request, getattr(badge.badge, "image", None)) if badge.badge else None,
                "challenge_title": getattr(badge.coding_challenge, "title", None),
                "earned_at": badge.earned_at,
            }
            for badge in StudentBadge.objects.filter(student=student).select_related("badge", "coding_challenge")
        ]

        def challenge_section(title: str) -> Dict[str, Any]:
            items = [
                {
                    "id": challenge.pk,
                    "title": challenge.title,
                    "difficulty": challenge.difficulty,
                    "course_title": challenge.course.title if challenge.course else None,
                }
                for challenge in CodingChallenge.objects.filter(
                    is_archived=False,
                    course__title__icontains=title,
                )
                .select_related("course")[:5]
            ]
            return {"title": title, "items": items}

        data = {
            "user": {
                "user_id": user.user_id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "photo": self.absolute_url(request, getattr(user, "photo", None)),
                "preferred_language": student.preferred_language,
                "streak_days": student.days_active,
                "requires_onboarding": not student.has_completed_onboarding,
            },
            "notifications": {
                "unread": notifications_count,
                "messages": messages_count,
            },
            "overview": course_overview,
            "resume_learning": resume_learning_payload,
            "recommended_courses": [serialize_course(course) for course in recommended_courses],
            "badges": badges_payload,
            "practice": {
                "sections": [
                    challenge_section("HTML"),
                    challenge_section("CSS"),
                    challenge_section("Javascript"),
                    challenge_section("Python"),
                ]
            },
        }

        return Response({"message": "Successful", "data": data})


class CourseCatalogView(StudentExperienceBaseView):
    def get(self, request):
        student = self.get_student(request)
        queryset = Course.objects.filter(status=PublishStatus.PUBLISHED, is_archived=False)

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(summary__icontains=search)
                | Q(description__icontains=search)
            )

        level = request.query_params.get("level")
        if level:
            queryset = queryset.filter(level__iexact=level)

        tags = request.query_params.getlist("tag") or request.query_params.getlist("tags")
        if tags:
            queryset = queryset.filter(tags__contains=list(tags))

        queryset = queryset.annotate(
            modules_count=Count("modules", filter=Q(modules__status=PublishStatus.PUBLISHED), distinct=True),
            lessons_count=Count("lessons", filter=Q(lessons__status=PublishStatus.PUBLISHED), distinct=True),
        ).order_by("title")

        paginator = PageNumberPagination()
        try:
            page_size = int(request.query_params.get("page_size", 12))
        except ValueError:
            page_size = 12
        paginator.page_size = max(1, min(page_size, 50))

        page = paginator.paginate_queryset(queryset, request)

        student_courses = (
            StudentCourse.objects.filter(student=student)
            .select_related("course")
            .prefetch_related(
                Prefetch(
                    "course_lesson",
                    queryset=StudentLesson.objects.select_related("lesson").order_by("-updated_at"),
                )
            )
        )
        enrollments = {item.course.course_id: item for item in student_courses}
        resume_map = build_resume_map(student_courses)

        serializer = CourseCatalogSerializer(
            page,
            many=True,
            context={
                "request": request,
                "enrollments": enrollments,
                "resume_map": resume_map,
            },
        )
        return paginator.get_paginated_response(serializer.data)


class CourseDetailView(StudentExperienceBaseView):
    def get(self, request, course_id: str):
        student = self.get_student(request)
        course = get_object_or_404(
            Course.objects.filter(status=PublishStatus.PUBLISHED, is_archived=False)
            .prefetch_related(
                Prefetch(
                    "modules",
                    queryset=Module.objects.filter(status=PublishStatus.PUBLISHED)
                    .prefetch_related(
                        Prefetch(
                            "lessons",
                            queryset=Lesson.objects.filter(status=PublishStatus.PUBLISHED).order_by("order"),
                        )
                    )
                    .order_by("order"),
                )
            ),
            course_id=course_id,
        )

        student_courses = StudentCourse.objects.filter(student=student, course=course).prefetch_related(
            Prefetch(
                "course_lesson",
                queryset=StudentLesson.objects.select_related("lesson").order_by("-updated_at"),
            )
        )
        enrollments = {item.course.course_id: item for item in student_courses}
        resume_map = build_resume_map(student_courses)

        serializer = CourseDetailSerializer(
            course,
            context={
                "request": request,
                "enrollments": enrollments,
                "resume_map": resume_map,
            },
        )
        return Response({"message": "Successful", "data": serializer.data})


class CourseEnrollmentView(StudentExperienceBaseView):
    def post(self, request, course_id: str):
        student = self.get_student(request)
        course = get_object_or_404(
            Course,
            course_id=course_id,
            status=PublishStatus.PUBLISHED,
            is_archived=False,
        )

        student_course, created = StudentCourse.objects.get_or_create(
            student=student,
            course=course,
            defaults={
                "completed": False,
                "lessons_completed": 0,
                "total_lessons": 0,
                "progress_percent": 0,
                "level": 0,
                "last_seen": timezone.now(),
            },
        )

        if created:
            published_lessons = course.lessons.filter(status=PublishStatus.PUBLISHED, is_archived=False)
            student_course.total_lessons = published_lessons.count()
            student_course.save(update_fields=["total_lessons"])

            StudentLesson.objects.bulk_create(
                [
                    StudentLesson(course=student_course, lesson=lesson)
                    for lesson in published_lessons
                ],
                ignore_conflicts=True,
            )

        serializer = CourseDetailSerializer(
            course,
            context={
                "request": request,
                "enrollments": {course.course_id: student_course},
                "resume_map": build_resume_map([student_course]),
            },
        )

        return Response({"message": "Successful", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def delete(self, request, course_id: str):
        student = self.get_student(request)
        try:
            student_course = StudentCourse.objects.get(student=student, course__course_id=course_id)
        except StudentCourse.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        student_course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def _lesson_file_url(request, file_field) -> Optional[str]:
    if not file_field:
        return None
    if hasattr(file_field, "url"):
        return request.build_absolute_uri(file_field.url)
    return str(file_field)


def _serialize_lesson_assets(request, assets: Iterable[Any], asset_type: str) -> List[Dict[str, Any]]:
    payload: List[Dict[str, Any]] = []
    for asset in assets:
        payload.append(
            {
                "id": asset.pk,
                "type": asset_type,
                "url": asset.video_url or _lesson_file_url(request, getattr(asset, "video_file", None)),
                "duration": getattr(asset, "duration", None),
                "language": getattr(asset, "language", None),
                "timestamp": getattr(asset, "timestamp", None),
                "subtitles_url": asset.subtitles_url,
            }
        )
    serializer = LessonAssetSerializer(data=payload, many=True)
    serializer.is_valid(raise_exception=False)
    return serializer.validated_data  # type: ignore[return-value]


class LessonPlaybackView(StudentExperienceBaseView):
    def get(self, request, lesson_id: str):
        student = self.get_student(request)
        lesson = get_object_or_404(
            Lesson.objects.select_related("course", "module"),
            lesson_id=lesson_id,
            status=PublishStatus.PUBLISHED,
            is_archived=False,
        )

        student_course = StudentCourse.objects.filter(student=student, course=lesson.course).first()
        if student_course is None:
            return Response({"message": "Not enrolled"}, status=status.HTTP_403_FORBIDDEN)

        student_lesson, _ = StudentLesson.objects.get_or_create(course=student_course, lesson=lesson)
        student_course.last_seen = timezone.now()
        student_course.save(update_fields=["last_seen"])

        primary_video_obj: Optional[LessonVideo] = (
            lesson.videos.filter(is_archived=False).order_by("id").first()
        )
        primary_video = (
            {
                "id": primary_video_obj.pk,
                "type": "primary",
                "url": primary_video_obj.video_url or _lesson_file_url(request, primary_video_obj.video_file),
                "duration": primary_video_obj.duration,
                "language": primary_video_obj.language,
                "timestamp": None,
                "subtitles_url": primary_video_obj.subtitles_url,
            }
            if primary_video_obj
            else None
        )

        insert_videos = _serialize_lesson_assets(
            request,
            lesson.insert_videos.filter(is_archived=False).order_by("timestamp"),
            asset_type="insert",
        )

        insert_outputs = [
            {
                "id": output.pk,
                "timestamp": output.timestamp,
                "content": output.content,
                "window_position": output.window_position,
                "window_dimension": output.window_dimension,
                "subtitles_url": output.subtitles_url,
            }
            for output in LessonInsertOutput.objects.filter(lesson=lesson, is_archived=False).order_by("timestamp")
        ]

        code_snippets = [
            {
                "id": snippet.pk,
                "timestamp": snippet.timestamp,
                "code_content": snippet.code_content,
                "cursor_position": snippet.cursor_position,
                "scroll_position": snippet.scroll_position,
                "is_highlight": snippet.is_highlight,
                "output": snippet.output,
            }
            for snippet in LessonCodeSnippet.objects.filter(lesson=lesson, is_archived=False).order_by("timestamp")
        ]

        assignments = [
            {
                "id": assignment.pk,
                "title": assignment.title,
                "instructions": assignment.instructions,
                "expected_output": assignment.expected_output,
                "code_template": assignment.code_template,
                "difficulty": assignment.difficulty,
            }
            for assignment in LessonAssignment.objects.filter(lesson=lesson, is_archived=False)
        ]

        download_manifest = []
        if primary_video:
            download_manifest.append({"type": "video", "label": "Lesson video", "url": primary_video["url"]})
            if primary_video.get("subtitles_url"):
                download_manifest.append({"type": "subtitles", "label": "Subtitles", "url": primary_video["subtitles_url"]})
        for asset in insert_videos:
            if asset.get("url"):
                download_manifest.append({"type": asset["type"], "label": f"Insert at {asset.get('timestamp', 0)}s", "url": asset["url"]})
            if asset.get("subtitles_url"):
                download_manifest.append({"type": "subtitles", "label": "Insert subtitles", "url": asset["subtitles_url"]})

        playback_state = {
            "completed": student_lesson.completed,
            "last_position_seconds": student_lesson.last_position_seconds,
            "resume_snippet_id": student_lesson.resume_code_id,
            "last_viewed_at": student_lesson.last_viewed_at,
        }

        payload = {
            "lesson": {
                "lesson_id": lesson.lesson_id,
                "title": lesson.title,
                "description": lesson.description,
                "duration_seconds": lesson.duration_seconds,
                "course": {
                    "course_id": lesson.course.course_id if lesson.course else None,
                    "title": lesson.course.title if lesson.course else None,
                    "slug": lesson.course.slug if lesson.course else None,
                },
                "module": {
                    "id": lesson.module.id if lesson.module else None,
                    "title": lesson.module.title if lesson.module else None,
                },
            },
            "primary_video": primary_video,
            "insert_videos": insert_videos,
            "insert_outputs": insert_outputs,
            "code_snippets": code_snippets,
            "assignments": assignments,
            "download_manifest": download_manifest,
            "playback_state": playback_state,
            "transcript": lesson.content,
        }

        serializer = LessonPlaybackSerializer(data=payload)
        serializer.is_valid(raise_exception=False)
        return Response({"message": "Successful", "data": serializer.validated_data})


class LessonProgressView(StudentExperienceBaseView):
    def post(self, request, lesson_id: str):
        student = self.get_student(request)
        lesson = get_object_or_404(Lesson, lesson_id=lesson_id)
        student_course = StudentCourse.objects.filter(student=student, course=lesson.course).first()
        if student_course is None:
            return Response({"message": "Not enrolled"}, status=status.HTTP_403_FORBIDDEN)

        student_lesson, _ = StudentLesson.objects.get_or_create(course=student_course, lesson=lesson)

        updates: List[str] = []
        last_position = request.data.get("last_position_seconds")
        if isinstance(last_position, (int, float)):
            student_lesson.last_position_seconds = max(0.0, float(last_position))
            updates.append("last_position_seconds")

        resume_snippet_id = request.data.get("resume_snippet_id")
        if resume_snippet_id:
            snippet = LessonCodeSnippet.objects.filter(lesson=lesson, pk=resume_snippet_id).first()
            if snippet:
                student_lesson.resume_code = snippet
                updates.append("resume_code")

        completed = request.data.get("completed")
        lesson_completed_now = False
        if completed is True and not student_lesson.completed:
            student_lesson.completed = True
            updates.append("completed")
            lesson_completed_now = True
        elif completed is False and student_lesson.completed:
            student_lesson.completed = False
            updates.append("completed")

        student_lesson.last_viewed_at = timezone.now()
        updates.append("last_viewed_at")

        if updates:
            student_lesson.save(update_fields=updates)

        _recalculate_course_progress(student_course)

        if lesson_completed_now:
            record_event(
                event_type=LearningEvent.TYPE_LESSON_COMPLETED,
                user=request.user,
                student=student,
                course=lesson.course,
                lesson=lesson,
                metadata={
                    "progress_percent": float(student_course.progress_percent or 0),
                    "lessons_completed": student_course.lessons_completed,
                    "total_lessons": student_course.total_lessons,
                },
            )

        response_payload = {
            "completed": student_lesson.completed,
            "last_position_seconds": student_lesson.last_position_seconds,
            "resume_snippet_id": student_lesson.resume_code_id,
            "progress_percent": float(student_course.progress_percent or 0),
        }
        return Response({"message": "Successful", "data": response_payload})


def _recalculate_course_progress(student_course: StudentCourse) -> None:
    lessons = StudentLesson.objects.filter(course=student_course)
    total = lessons.count()
    completed = lessons.filter(completed=True).count()
    student_course.total_lessons = total
    student_course.lessons_completed = completed
    student_course.progress_percent = (completed / total * 100) if total else 0
    student_course.last_seen = timezone.now()
    update_fields = [
        "total_lessons",
        "lessons_completed",
        "progress_percent",
        "last_seen",
    ]
    was_completed = student_course.completed
    now_completed = total > 0 and completed == total
    if was_completed != now_completed:
        student_course.completed = now_completed
        update_fields.append("completed")
    student_course.save(update_fields=update_fields)
    if now_completed and not was_completed:
        record_event(
            event_type=LearningEvent.TYPE_COURSE_COMPLETED,
            user=student_course.student.user,
            student=student_course.student,
            course=student_course.course,
            metadata={
                "lessons_completed": completed,
                "total_lessons": total,
            },
        )
