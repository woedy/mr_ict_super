from django.contrib import admin

from teachers.models import Classroom, Teacher, TeacherFeedback

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Classroom)
admin.site.register(TeacherFeedback)