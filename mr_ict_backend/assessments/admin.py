from django.contrib import admin

from assessments.models import Assessment, Question, StudentQuizAttempt

# Register your models here.
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(StudentQuizAttempt)

