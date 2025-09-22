from django.contrib import admin

from students.models import LessonFeedback, LessonNote, LessonNoteSnippet, ResumeLeaning, Student, StudentActivity, StudentBadge, StudentChallenge, StudentCourse, StudentLesson, StudentLessonAssignment, StudentLevel

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

