from django.contrib import admin

from llm_tutor.models import CodeSnapshot, Lesson, LessonStep

# Register your models here.
admin.site.register(Lesson)
admin.site.register(LessonStep)
admin.site.register(CodeSnapshot)


