from __future__ import annotations

from django.db import models
from django.template.defaultfilters import slugify
from django.utils import timezone

from courses.models import ChallengeBadge, Lesson
from students.models import Student


class Assessment(models.Model):
    """Quiz or practice assessment associated with a lesson."""

    lesson = models.ForeignKey(Lesson, related_name="assessments", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    passing_score = models.IntegerField(help_text="Percentage threshold required to pass")
    time_limit_seconds = models.PositiveIntegerField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=3)
    is_practice = models.BooleanField(default=False)
    reward_xp = models.PositiveIntegerField(default=50)
    reward_badge = models.ForeignKey(
        ChallengeBadge,
        related_name="assessments",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    issues_certificate = models.BooleanField(default=False)
    certificate_title = models.CharField(max_length=255, blank=True)
    available_from = models.DateTimeField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            suffix = 1
            while Assessment.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                suffix += 1
                slug = f"{base_slug}-{suffix}"
            self.slug = slug
        if self.available_from and self.available_until and self.available_from >= self.available_until:
            raise ValueError("available_from must be before available_until")
        super().save(*args, **kwargs)

    def is_available(self) -> bool:
        now = timezone.now()
        if self.available_from and now < self.available_from:
            return False
        if self.available_until and now > self.available_until:
            return False
        return self.active and not self.is_archived

    def total_points(self) -> int:
        return sum(question.points for question in self.questions.all())




class Question(models.Model):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    FREE_RESPONSE = "free_response"

    QUESTION_TYPES = (
        (MULTIPLE_CHOICE, "Multiple Choice"),
        (TRUE_FALSE, "True/False"),
        (FREE_RESPONSE, "Free Response"),
    )

    assessment = models.ForeignKey(Assessment, related_name="questions", on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    options = models.JSONField(null=True, blank=True)
    correct_answer = models.TextField()
    explanation = models.TextField(blank=True)
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=1)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("assessment", "order")

    def __str__(self) -> str:
        return self.question_text



class StudentQuizAttempt(models.Model):
    PASSED = "passed"
    FAILED = "failed"

    STATUS_CHOICES = ((PASSED, "Passed"), (FAILED, "Failed"))

    student = models.ForeignKey(Student, related_name="quiz_attempts", on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, related_name="attempts", on_delete=models.CASCADE)
    answers = models.JSONField()
    score = models.IntegerField()
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    awarded_xp = models.PositiveIntegerField(default=0)
    feedback = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(auto_now=True)
    duration_seconds = models.PositiveIntegerField(default=0)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        student_name = getattr(self.student.user, "first_name", "Student")
        return f"Attempt by {student_name} on {self.assessment.title}"