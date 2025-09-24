from __future__ import annotations

from typing import Any

from rest_framework import serializers

from courses.models import (
    ContentAuditLog,
    Course,
    Lesson,
    LessonInsertOutput,
    LessonInsertVideo,
    LessonIntroVideo,
    LessonVideo,
    Module,
    PublishStatus,
)


class LessonVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonVideo
        fields = [
            "id",
            "lesson",
            "video_url",
            "subtitles_url",
            "duration",
            "video_file",
            "language",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class LessonIntroVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonIntroVideo
        fields = "__all__"


class LessonInsertVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonInsertVideo
        fields = "__all__"


class LessonInsertOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonInsertOutput
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    videos = LessonVideoSerializer(many=True, read_only=True)
    module_title = serializers.CharField(source="module.title", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "lesson_id",
            "course",
            "module",
            "module_title",
            "title",
            "description",
            "content",
            "video_url",
            "order",
            "duration_seconds",
            "thumbnail",
            "status",
            "status_display",
            "review_notes",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "videos",
        ]
        read_only_fields = [
            "id",
            "lesson_id",
            "course",
            "status_display",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "videos",
        ]

    def validate_module(self, value: Module | None) -> Module | None:
        if value is None:
            return value
        request = self.context.get("request")
        if request and not request.user.is_staff:
            raise serializers.ValidationError("Only staff can reassign lessons between modules.")
        return value


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Module
        fields = [
            "id",
            "course",
            "title",
            "description",
            "order",
            "status",
            "status_display",
            "review_notes",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "lessons",
        ]
        read_only_fields = [
            "id",
            "status_display",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "lessons",
        ]


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "course_id",
            "slug",
            "title",
            "summary",
            "description",
            "image",
            "tags",
            "level",
            "estimated_duration_minutes",
            "status",
            "status_display",
            "review_notes",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "modules",
        ]
        read_only_fields = [
            "id",
            "course_id",
            "slug",
            "status_display",
            "submitted_for_review_at",
            "published_at",
            "created_at",
            "updated_at",
            "modules",
        ]

    def validate_tags(self, value: Any) -> list[str]:
        if isinstance(value, list):
            if any(not isinstance(item, str) for item in value):
                raise serializers.ValidationError("Tags must be an array of strings.")
            return value
        if value in ("", None):
            return []
        raise serializers.ValidationError("Tags must be provided as an array of strings.")


class StatusNotesSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)


class ContentAuditLogSerializer(serializers.ModelSerializer):
    content_object_repr = serializers.SerializerMethodField()

    class Meta:
        model = ContentAuditLog
        fields = [
            "id",
            "content_type",
            "object_id",
            "from_status",
            "to_status",
            "notes",
            "performed_by",
            "created_at",
            "content_object_repr",
        ]
        read_only_fields = fields

    def get_content_object_repr(self, obj: ContentAuditLog) -> str:
        return str(obj.content_object)


class PublishStatusField(serializers.ChoiceField):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(choices=PublishStatus.choices, **kwargs)
