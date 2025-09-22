from django.db import models
from django.contrib.auth.models import User




class Recording(models.Model):
    title = models.CharField(max_length=1000, unique=True)
    description = models.TextField(blank=True, null=True)
    video_file = models.FileField(upload_to='recordings/')  # Store videos in a 'videos' folder

    duration = models.FloatField()  # Seconds from start of video
    published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Video {self.id} uploaded at {self.created_at}'


class CodeSnapshotRecording(models.Model):
    title = models.CharField(max_length=1000)
    timestamp = models.FloatField()  # Seconds from start of video
    recording = models.ForeignKey(Recording, on_delete=models.CASCADE, null=True, blank=True, related_name='code_records')
    code_content = models.TextField()  # Full code at this timestamp
    cursor_position = models.JSONField(default=dict)  # e.g. {"line": 10, "column": 15}
    scroll_position = models.JSONField(default=dict)  # e.g. {"scrollTop": 0, "scrollLeft": 0}
    is_highlight = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']





class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.title

class ProjectFile(models.Model):
    FILE_TYPES = (
        ('html', 'HTML'),
        ('css', 'CSS'),
        ('js', 'JavaScript'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    content = models.TextField(blank=True)
    name = models.CharField(max_length=100)  # e.g., "index.html", "styles.css", "scripts.js"
    
    def __str__(self):
        return f"{self.project.title} - {self.name}"
    
    class Meta:
        unique_together = ('project', 'name')
