from django.db import models

from courses.models import Lesson
from students.models import Student


class Assessment(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='assessments', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    passing_score = models.IntegerField()  # e.g., 70% passing grade

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title




class Question(models.Model):
    assessment = models.ForeignKey(Assessment, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=[('multiple_choice', 'Multiple Choice'), ('true_false', 'True/False')])
    options = models.JSONField(null=True, blank=True)  # Stores options for MCQs in JSON format
    correct_answer = models.TextField()

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.question_text



class StudentQuizAttempt(models.Model):
    student = models.ForeignKey(Student, related_name='quiz_attempts', on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, related_name='attempts', on_delete=models.CASCADE)
    answers = models.JSONField()  # Store the answers the student provided (JSON object)
    score = models.IntegerField()
    status = models.CharField(max_length=10, choices=[('passed', 'Passed'), ('failed', 'Failed')])
    attempted_at = models.DateTimeField(auto_now_add=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Attempt by {self.student.user.first_name} on {self.assessment.title}"