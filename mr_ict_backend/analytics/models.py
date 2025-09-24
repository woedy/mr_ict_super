from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils import timezone


class LearningEvent(models.Model):
    """Normalized record of learner and admin interactions for analytics."""

    SOURCE_BACKEND = "backend"
    SOURCE_FRONTEND = "frontend"

    TYPE_LESSON_VIEWED = "lesson_viewed"
    TYPE_LESSON_COMPLETED = "lesson_completed"
    TYPE_COURSE_COMPLETED = "course_completed"
    TYPE_ASSESSMENT_STARTED = "assessment_started"
    TYPE_ASSESSMENT_COMPLETED = "assessment_completed"
    TYPE_XP_AWARDED = "xp_awarded"
    TYPE_COMMENT_CREATED = "comment_created"
    TYPE_ANNOUNCEMENT_PUBLISHED = "announcement_published"
    TYPE_NOTIFICATION_READ = "notification_read"

    SOURCE_CHOICES = (
        (SOURCE_BACKEND, "Backend"),
        (SOURCE_FRONTEND, "Frontend"),
    )

    EVENT_CHOICES = (
        (TYPE_LESSON_VIEWED, "Lesson viewed"),
        (TYPE_LESSON_COMPLETED, "Lesson completed"),
        (TYPE_COURSE_COMPLETED, "Course completed"),
        (TYPE_ASSESSMENT_STARTED, "Assessment started"),
        (TYPE_ASSESSMENT_COMPLETED, "Assessment completed"),
        (TYPE_XP_AWARDED, "XP awarded"),
        (TYPE_COMMENT_CREATED, "Comment created"),
        (TYPE_ANNOUNCEMENT_PUBLISHED, "Announcement published"),
        (TYPE_NOTIFICATION_READ, "Notification read"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="analytics_events",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    student = models.ForeignKey(
        "students.Student",
        related_name="analytics_events",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    course = models.ForeignKey(
        "courses.Course",
        related_name="analytics_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    lesson = models.ForeignKey(
        "courses.Lesson",
        related_name="analytics_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    assessment = models.ForeignKey(
        "assessments.Assessment",
        related_name="analytics_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    event_type = models.CharField(max_length=64, choices=EVENT_CHOICES)
    source = models.CharField(max_length=32, choices=SOURCE_CHOICES, default=SOURCE_BACKEND)
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-occurred_at", "-id"]
        indexes = [
            models.Index(fields=["event_type", "occurred_at"]),
            models.Index(fields=["student", "occurred_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.get_event_type_display()} ({self.occurred_at:%Y-%m-%d %H:%M:%S})"


class DailyEngagementSummary(models.Model):
    """Aggregated analytics snapshot for a specific date."""

    date = models.DateField(unique=True)
    total_students = models.PositiveIntegerField(default=0)
    active_students = models.PositiveIntegerField(default=0)
    new_students = models.PositiveIntegerField(default=0)
    lessons_viewed = models.PositiveIntegerField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    courses_completed = models.PositiveIntegerField(default=0)
    assessments_completed = models.PositiveIntegerField(default=0)
    comments_posted = models.PositiveIntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    certificates_issued = models.PositiveIntegerField(default=0)

    metadata = models.JSONField(default=dict, blank=True)
    generated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"Summary for {self.date:%Y-%m-%d}"
