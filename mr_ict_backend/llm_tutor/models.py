from django.db import models
from django.contrib.auth import get_user_model

import uuid


User = get_user_model()

class Lesson(models.Model):
    lesson_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class LessonStep(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    expected_code = models.TextField()
    description = models.TextField()
    estimated_duration = models.IntegerField()  # In seconds

    class Meta:
        unique_together = ('lesson', 'step_number')

class CodeSnapshot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    step = models.ForeignKey(LessonStep, on_delete=models.CASCADE)
    code = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    branch_id = models.CharField(max_length=36, null=True, default=None)
    interaction_start = models.DateTimeField(auto_now_add=True)
    interaction_end = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - Step {self.step.step_number}"