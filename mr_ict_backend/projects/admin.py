from django.contrib import admin

from projects.models import Project, ProjectFile

# Register your models here.
admin.site.register(Project)
admin.site.register(ProjectFile)