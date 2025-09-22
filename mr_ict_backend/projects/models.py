from django.db import models


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
        ('HTML', 'HTML'),
        ('CSS', 'CSS'),
        ('JavaScript', 'JavaScript'),
        ('Python', 'Python'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    content = models.TextField(blank=True)
    name = models.CharField(max_length=100)  # e.g., "index.html", "styles.css", "scripts.js"
    
    def __str__(self):
        return f"{self.project.title} - {self.name}"
    
    class Meta:
        unique_together = ('project', 'name')