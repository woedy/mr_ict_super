from django.contrib import admin

from courses.models import (
    ChallengeBadge,
    CodingChallenge,
    ContentAuditLog,
    Course,
    CourseInstructor,
    Lesson,
    LessonAssignment,
    LessonCodeSnippet,
    LessonInsertVideo,
    LessonIntroVideo,
    LessonVersionMarker,
    LessonVideo,
    Module,
    Motivation,
)

# Register your models here.
admin.site.register(Course)
admin.site.register(CourseInstructor)
admin.site.register(Lesson)
admin.site.register(LessonVersionMarker)
admin.site.register(LessonIntroVideo)
admin.site.register(LessonInsertVideo)
admin.site.register(LessonVideo)
admin.site.register(LessonCodeSnippet)
admin.site.register(LessonAssignment)
admin.site.register(CodingChallenge)
admin.site.register(ChallengeBadge)
admin.site.register(Motivation)
admin.site.register(Module)
admin.site.register(ContentAuditLog)
