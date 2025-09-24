from rest_framework import serializers

from notifications.models import Announcement, Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "subject",
            "read",
            "created_at",
            "updated_at",
        ]


class AnnouncementSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    published_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "body",
            "audience",
            "course",
            "course_title",
            "published_by",
            "published_by_name",
            "published_at",
            "expires_at",
            "is_pinned",
        ]

    def get_published_by_name(self, obj: Announcement) -> str | None:
        if obj.published_by:
            return obj.published_by.get_full_name() or obj.published_by.username
        return None



