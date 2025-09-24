from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from analytics.models import LearningEvent
from analytics.services import record_event
from courses.models import Lesson, PublishStatus
from students.api.views import StudentExperienceBaseView
from students.models import LessonComment


def user_display_name(user) -> str:
    parts = [getattr(user, 'first_name', ''), getattr(user, 'last_name', '')]
    candidate = ' '.join(part for part in parts if part).strip()
    if candidate:
        return candidate
    return getattr(user, 'username', '') or getattr(user, 'email', '')


class LessonCommentListCreateView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id: str):
        self.get_student(request)
        lesson = get_object_or_404(
            Lesson.objects.select_related("course"),
            lesson_id=lesson_id,
            is_archived=False,
        )
        comments = (
            LessonComment.objects.filter(lesson=lesson, is_archived=False, active=True, parent__isnull=True)
            .select_related("student__user")
            .prefetch_related("replies", "likes")
            .order_by("-is_pinned", "-created_at")
        )

        def serialize_comment(comment: LessonComment) -> dict:
            return {
                "id": comment.pk,
                "student": {
                    "id": comment.student.pk,
                    "name": user_display_name(comment.student.user),
                },
                "body": comment.body,
                "created_at": comment.created_at,
                "is_pinned": comment.is_pinned,
                "like_count": comment.like_count,
                "liked": comment.likes.filter(id=request.user.id).exists(),
                "replies": [
                    {
                        "id": reply.pk,
                        "student": {
                            "id": reply.student.pk,
                            "name": user_display_name(reply.student.user),
                        },
                        "body": reply.body,
                        "created_at": reply.created_at,
                        "like_count": reply.like_count,
                        "liked": reply.likes.filter(id=request.user.id).exists(),
                    }
                    for reply in comment.replies.filter(is_archived=False, active=True).select_related("student__user")
                ],
            }

        data = [serialize_comment(comment) for comment in comments]
        return Response({"message": "Successful", "data": data})

    def post(self, request, lesson_id: str):
        student = self.get_student(request)
        lesson = get_object_or_404(
            Lesson.objects.select_related("course"),
            lesson_id=lesson_id,
            status=PublishStatus.PUBLISHED,
            is_archived=False,
        )
        body = request.data.get("body", "").strip()
        parent_id = request.data.get("parent_id")
        if not body:
            return Response({"message": "Comment body cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        parent = None
        if parent_id:
            parent = get_object_or_404(LessonComment, pk=parent_id, lesson=lesson)

        comment = LessonComment.objects.create(
            lesson=lesson,
            student=student,
            body=body,
            parent=parent,
            active=True,
            is_archived=False,
        )

        record_event(
            event_type=LearningEvent.TYPE_COMMENT_CREATED,
            user=request.user,
            student=student,
            course=lesson.course,
            lesson=lesson,
            metadata={"parent_id": parent.pk if parent else None},
        )

        response = {
            "id": comment.pk,
            "student": {
                "id": student.pk,
                "name": user_display_name(student.user),
            },
            "body": comment.body,
            "created_at": comment.created_at,
            "like_count": comment.like_count,
            "liked": False,
            "replies": [],
        }
        return Response({"message": "Successful", "data": response}, status=status.HTTP_201_CREATED)


class LessonCommentLikeView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id: int):
        student = self.get_student(request)
        comment = get_object_or_404(LessonComment.objects.select_related("lesson"), pk=comment_id, is_archived=False)
        liked = comment.likes.filter(id=request.user.id).exists()
        if liked:
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)
        return Response(
            {
                "message": "Successful",
                "data": {
                    "liked": not liked,
                    "like_count": comment.like_count,
                },
            }
        )
