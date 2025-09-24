from django.contrib.auth import get_user_model
from django.db import models

from courses.models import Course

User = get_user_model()


class Notification(models.Model):
    title = models.CharField(max_length=1000, null=True, blank=True)
    subject = models.TextField(null=True, blank=True)
    read = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications")

    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Announcement(models.Model):
    AUDIENCE_ALL = "all"
    AUDIENCE_COURSE = "course"

    AUDIENCE_CHOICES = (
        (AUDIENCE_ALL, "All Students"),
        (AUDIENCE_COURSE, "Course"),
    )

    title = models.CharField(max_length=255)
    body = models.TextField()
    audience = models.CharField(max_length=32, choices=AUDIENCE_CHOICES, default=AUDIENCE_ALL)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True, related_name="announcements")
    published_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="published_announcements",
    )
    published_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_pinned = models.BooleanField(default=False)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_pinned", "-published_at"]

    def __str__(self) -> str:
        return self.title

    def is_visible_to_course(self, course: Course | None) -> bool:
        if self.audience == self.AUDIENCE_ALL:
            return True
        if self.audience == self.AUDIENCE_COURSE and course is not None:
            return self.course_id == course.id
        return False
