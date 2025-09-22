from django.contrib import admin

from video_tutorials.models import CodeSnapshotRecording, Project, ProjectFile, Recording

# Register your models here.
admin.site.register(Recording)
admin.site.register(CodeSnapshotRecording)
admin.site.register(Project)
admin.site.register(ProjectFile)