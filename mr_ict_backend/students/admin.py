from django.contrib import admin

from students.models import (
    LessonComment,
    LessonFeedback,
    LessonNote,
    LessonNoteSnippet,
    ResumeLeaning,
    Student,
    StudentActivity,
    StudentBadge,
    StudentCertificate,
    StudentChallenge,
    StudentCourse,
    StudentLesson,
    StudentLessonAssignment,
    StudentLevel,
    StudentXPEvent,
)

# Register your models here.
admin.site.register(Student)
admin.site.register(StudentLevel)
admin.site.register(StudentCourse)
admin.site.register(StudentLesson)
admin.site.register(LessonNote)
admin.site.register(LessonNoteSnippet)
admin.site.register(StudentChallenge)
admin.site.register(ResumeLeaning)
admin.site.register(LessonFeedback)
admin.site.register(StudentLessonAssignment)
admin.site.register(StudentBadge)
admin.site.register(StudentActivity)
admin.site.register(StudentCertificate)
admin.site.register(StudentXPEvent)
admin.site.register(LessonComment)

