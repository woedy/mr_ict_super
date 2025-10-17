from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional

from django.utils import timezone
from rest_framework import serializers

from courses.models import CodingChallenge, Course, Lesson, LessonCodeSnippet, Module, PublishStatus
from students.models import (
    Student,
    StudentCodingChallengeState,
    StudentCourse,
    StudentLesson,
    StudentProject,
)
from students.services.coding import CodeExecutionError, normalise_execution_files


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    photo = serializers.SerializerMethodField()
    school_name = serializers.CharField(source="school.name", read_only=True)
    accessibility_preferences = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    interest_tags = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Student
        fields = [
            "student_id",
            "email",
            "first_name",
            "last_name",
            "photo",
            "school_name",
            "preferred_language",
            "accessibility_preferences",
            "interest_tags",
            "allow_offline_downloads",
            "has_completed_onboarding",
            "onboarding_completed_at",
        ]
        read_only_fields = [
            "student_id",
            "email",
            "first_name",
            "last_name",
            "photo",
            "school_name",
            "has_completed_onboarding",
            "onboarding_completed_at",
        ]

    def get_photo(self, obj: Student) -> Optional[str]:
        photo = getattr(obj.user, "photo", None)
        if photo and hasattr(photo, "url"):
            request = self.context.get("request")
            if request is not None:
                return request.build_absolute_uri(photo.url)
            return photo.url
        return None

    def update(self, instance: Student, validated_data: Dict[str, Any]) -> Student:
        dirty_fields: set[str] = set()

        for field in ["preferred_language", "allow_offline_downloads"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
                dirty_fields.add(field)

        if "accessibility_preferences" in validated_data:
            prefs = [item.strip() for item in validated_data["accessibility_preferences"] if item]
            instance.accessibility_preferences = sorted(set(prefs))
            dirty_fields.add("accessibility_preferences")

        if "interest_tags" in validated_data:
            tags = [item.strip() for item in validated_data["interest_tags"] if item]
            instance.interest_tags = sorted(set(tags))
            dirty_fields.add("interest_tags")

        mark_complete = self.context.get("mark_onboarding_complete", False)
        if mark_complete and not instance.has_completed_onboarding:
            instance.has_completed_onboarding = True
            instance.onboarding_completed_at = timezone.now()
            dirty_fields.update({"has_completed_onboarding", "onboarding_completed_at"})

        if dirty_fields:
            instance.save(update_fields=list(dirty_fields))
        return instance


class LessonSummarySerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ["lesson_id", "title", "description", "order", "duration_seconds", "thumbnail"]

    def get_thumbnail(self, obj: Lesson) -> Optional[str]:
        thumbnail = getattr(obj, "thumbnail", None)
        if thumbnail and hasattr(thumbnail, "url"):
            request = self.context.get("request")
            if request is not None:
                return request.build_absolute_uri(thumbnail.url)
            return thumbnail.url
        return None


class ModuleDetailSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lessons"]

    def get_lessons(self, obj: Module):
        lessons_qs = obj.lessons.filter(status=PublishStatus.PUBLISHED).order_by("order")
        return LessonSummarySerializer(
            lessons_qs,
            many=True,
            context={"request": self.context.get("request")},
        ).data


class CourseCatalogSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()
    resume_lesson_id = serializers.SerializerMethodField()
    modules_count = serializers.IntegerField(read_only=True)
    lessons_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "course_id",
            "slug",
            "title",
            "summary",
            "description",
            "level",
            "estimated_duration_minutes",
            "tags",
            "image",
            "modules_count",
            "lessons_count",
            "is_enrolled",
            "progress_percent",
            "resume_lesson_id",
        ]
        read_only_fields = [
            "course_id",
            "slug",
            "tags",
            "modules_count",
            "lessons_count",
            "is_enrolled",
            "progress_percent",
            "resume_lesson_id",
        ]

    def _build_absolute(self, path: Optional[str]) -> Optional[str]:
        if not path:
            return None
        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(path)
        return path

    def get_image(self, obj: Course) -> Optional[str]:
        if obj.image and hasattr(obj.image, "url"):
            return self._build_absolute(obj.image.url)
        return None

    def _get_student_course(self, obj: Course) -> Optional[StudentCourse]:
        enrollments: Dict[str, StudentCourse] = self.context.get("enrollments", {})
        return enrollments.get(obj.course_id)

    def get_is_enrolled(self, obj: Course) -> bool:
        return self._get_student_course(obj) is not None

    def get_progress_percent(self, obj: Course) -> float:
        student_course = self._get_student_course(obj)
        if not student_course or student_course.progress_percent is None:
            return 0.0
        return float(student_course.progress_percent)

    def get_resume_lesson_id(self, obj: Course) -> Optional[str]:
        resume_map: Dict[str, Optional[str]] = self.context.get("resume_map", {})
        return resume_map.get(obj.course_id)


class CourseDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    modules = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()
    resume_lesson_id = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "course_id",
            "slug",
            "title",
            "summary",
            "description",
            "level",
            "estimated_duration_minutes",
            "tags",
            "image",
            "modules",
            "is_enrolled",
            "progress_percent",
            "resume_lesson_id",
        ]

    def get_image(self, obj: Course) -> Optional[str]:
        if obj.image and hasattr(obj.image, "url"):
            request = self.context.get("request")
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def _get_student_course(self, obj: Course) -> Optional[StudentCourse]:
        enrollments: Dict[str, StudentCourse] = self.context.get("enrollments", {})
        return enrollments.get(obj.course_id)

    def get_is_enrolled(self, obj: Course) -> bool:
        return self._get_student_course(obj) is not None

    def get_progress_percent(self, obj: Course) -> float:
        student_course = self._get_student_course(obj)
        if not student_course or student_course.progress_percent is None:
            return 0.0
        return float(student_course.progress_percent)

    def get_resume_lesson_id(self, obj: Course) -> Optional[str]:
        resume_map: Dict[str, Optional[str]] = self.context.get("resume_map", {})
        return resume_map.get(obj.course_id)

    def get_modules(self, obj: Course) -> Iterable[Dict[str, Any]]:
        request = self.context.get("request")
        modules = (
            obj.modules.filter(status=PublishStatus.PUBLISHED)
            .prefetch_related("lessons")
            .order_by("order")
        )
        serializer = ModuleDetailSerializer(modules, many=True, context={"request": request})
        lessons_payload = []
        for module_data in serializer.data:
            lessons = [lesson for lesson in module_data["lessons"] if lesson]
            module_payload = {
                "id": module_data["id"],
                "title": module_data["title"],
                "description": module_data["description"],
                "order": module_data["order"],
                "lessons": lessons,
            }
            lessons_payload.append(module_payload)
        return lessons_payload


class CodingChallengeStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCodingChallengeState
        fields = [
            "hints_revealed",
            "last_run_result",
            "last_run_at",
            "is_completed",
            "completed_at",
        ]


class CodingChallengeListSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    last_run = serializers.SerializerMethodField()

    class Meta:
        model = CodingChallenge
        fields = [
            "slug",
            "title",
            "difficulty",
            "entrypoint_filename",
            "time_limit_seconds",
            "is_completed",
            "last_run",
        ]

    def _get_state(self, obj: CodingChallenge) -> Optional[StudentCodingChallengeState]:
        state_map = self.context.get("state_map", {})
        return state_map.get(obj.pk)

    def get_is_completed(self, obj: CodingChallenge) -> bool:
        state = self._get_state(obj)
        return bool(state and state.is_completed)

    def get_last_run(self, obj: CodingChallenge) -> Optional[Dict[str, Any]]:
        state = self._get_state(obj)
        if not state or not state.last_run_result:
            return None
        data = dict(state.last_run_result)
        data["last_run_at"] = state.last_run_at
        return data


class CodingChallengeDetailSerializer(serializers.ModelSerializer):
    starter_files = serializers.SerializerMethodField()
    solution_available = serializers.SerializerMethodField()
    current_files = serializers.SerializerMethodField()
    hints = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()

    class Meta:
        model = CodingChallenge
        fields = [
            "slug",
            "title",
            "instructions",
            "difficulty",
            "expected_output",
            "entrypoint_filename",
            "starter_files",
            "solution_available",
            "current_files",
            "hints",
            "time_limit_seconds",
            "state",
        ]

    def _get_state(self, obj: CodingChallenge) -> Optional[StudentCodingChallengeState]:
        return self.context.get("state")

    def get_current_files(self, obj: CodingChallenge) -> List[Dict[str, Any]]:
        state = self._get_state(obj)
        source = state.files if state and state.files else obj.starter_files
        try:
            return normalise_execution_files(source or [])
        except CodeExecutionError:
            return []

    def get_starter_files(self, obj: CodingChallenge) -> List[Dict[str, Any]]:
        try:
            return normalise_execution_files(obj.starter_files or [])
        except CodeExecutionError:
            return []

    def get_solution_available(self, obj: CodingChallenge) -> bool:
        state = self._get_state(obj)
        return bool(obj.solution_files and state and state.is_completed)

    def get_hints(self, obj: CodingChallenge) -> Dict[str, Any]:
        total_hints = obj.hints or []
        state = self._get_state(obj)
        revealed_count = state.hints_revealed if state else 0
        revealed = total_hints[:revealed_count]
        remaining = max(len(total_hints) - revealed_count, 0)
        return {
            "revealed": revealed,
            "remaining": remaining,
        }

    def get_state(self, obj: CodingChallenge) -> Optional[Dict[str, Any]]:
        state = self._get_state(obj)
        if not state:
            return None
        serializer = CodingChallengeStateSerializer(state)
        return serializer.data


class StudentProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProject
        fields = [
            "project_id",
            "title",
            "description",
            "is_published",
            "updated_at",
            "last_validated_at",
            "last_validation_result",
        ]
        read_only_fields = [
            "project_id",
            "updated_at",
            "last_validated_at",
            "last_validation_result",
        ]


class StudentProjectDetailSerializer(StudentProjectSerializer):
    files = serializers.ListField(child=serializers.DictField(), read_only=True)
    validation_schema = serializers.DictField(read_only=True)

    class Meta(StudentProjectSerializer.Meta):
        fields = StudentProjectSerializer.Meta.fields + ["files", "validation_schema"]


class LessonAssetSerializer(serializers.Serializer):
    id = serializers.CharField()  # Changed from IntegerField to CharField to handle UUIDs
    type = serializers.CharField()
    url = serializers.CharField()
    duration = serializers.FloatField(required=False, allow_null=True)
    language = serializers.CharField(required=False, allow_null=True)
    timestamp = serializers.FloatField(required=False, allow_null=True)
    subtitles_url = serializers.CharField(required=False, allow_null=True)


class LessonPlaybackSerializer(serializers.Serializer):
    lesson = serializers.DictField()
    primary_video = serializers.DictField(allow_null=True)
    insert_videos = LessonAssetSerializer(many=True)
    insert_outputs = serializers.ListField(child=serializers.DictField())
    code_snippets = serializers.ListField(child=serializers.DictField())
    assignments = serializers.ListField(child=serializers.DictField())
    download_manifest = serializers.ListField(child=serializers.DictField())
    playback_state = serializers.DictField()
    transcript = serializers.CharField(allow_null=True, allow_blank=True)


def build_resume_map(student_courses: Iterable[StudentCourse]) -> Dict[str, Optional[str]]:
    resume: Dict[str, Optional[str]] = {}
    for student_course in student_courses:
        lessons = list(student_course.course_lesson.all())
        next_lesson: Optional[StudentLesson] = None
        for lesson in lessons:
            if not lesson.completed:
                if next_lesson is None or lesson.updated_at > next_lesson.updated_at:
                    next_lesson = lesson
        if next_lesson is None and lessons:
            next_lesson = max(lessons, key=lambda item: item.updated_at)
        resume[student_course.course.course_id] = (
            next_lesson.lesson.lesson_id if next_lesson else None
        )
    return resume
