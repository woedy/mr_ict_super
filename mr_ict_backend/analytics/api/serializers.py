from __future__ import annotations

from rest_framework import serializers

from analytics.models import LearningEvent


class LearningEventCreateSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=LearningEvent.EVENT_CHOICES)
    occurred_at = serializers.DateTimeField(required=False)
    source = serializers.ChoiceField(
        choices=LearningEvent.SOURCE_CHOICES,
        required=False,
        default=LearningEvent.SOURCE_FRONTEND,
    )
    course_id = serializers.CharField(required=False, allow_blank=True)
    lesson_id = serializers.CharField(required=False, allow_blank=True)
    assessment_slug = serializers.CharField(required=False, allow_blank=True)
    metadata = serializers.DictField(required=False, default=dict)


class AdminRecentActivitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    event_type = serializers.CharField()
    description = serializers.CharField()
    actor = serializers.CharField(allow_null=True)
    context = serializers.CharField(allow_null=True)
    occurred_at = serializers.DateTimeField()
    metadata = serializers.DictField()


class AdminTimeseriesPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    activeStudents = serializers.IntegerField()
    lessonsCompleted = serializers.IntegerField()
    assessmentsCompleted = serializers.IntegerField()
    xpAwarded = serializers.IntegerField()


class AdminTopCourseSerializer(serializers.Serializer):
    courseId = serializers.CharField(allow_null=True)
    title = serializers.CharField(allow_null=True)
    enrollments = serializers.IntegerField()
    completions = serializers.IntegerField()
    completionRate = serializers.FloatField()


class AnnouncementSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    audience = serializers.CharField()
    published_at = serializers.DateTimeField(allow_null=True)
    expires_at = serializers.DateTimeField(allow_null=True)
    course = serializers.CharField(allow_null=True)


class AdminSummarySerializer(serializers.Serializer):
    stats = serializers.DictField(child=serializers.FloatField())
    recent_activity = AdminRecentActivitySerializer(many=True)
    timeseries = AdminTimeseriesPointSerializer(many=True)
    top_courses = AdminTopCourseSerializer(many=True)
    announcements = AnnouncementSummarySerializer(many=True)
