from django.db import models
from django.db.models.signals import post_save, pre_save

from core.utils import unique_course_id_generator, unique_lesson_id_generator



class Course(models.Model):
    course_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    title = models.CharField(max_length=1000, unique=True,)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', blank=True, null=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


def pre_save_course_id_receiver(sender, instance, *args, **kwargs):
    if not instance.course_id:
        instance.course_id = unique_course_id_generator(instance)

pre_save.connect(pre_save_course_id_receiver, sender=Course)




class Lesson(models.Model):
    lesson_id = models.CharField(max_length=1000, unique=True,)
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=1000, unique=True)
    description = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    order = models.IntegerField()

    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']



def pre_save_lesson_id_receiver(sender, instance, *args, **kwargs):
    if not instance.lesson_id:
        instance.lesson_id = unique_lesson_id_generator(instance)

pre_save.connect(pre_save_lesson_id_receiver, sender=Lesson)



class LessonIntroVideo(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='intro_videos', on_delete=models.CASCADE)
    subtitles_url = models.URLField(null=True, blank=True)  # Optional for subtitles
    duration = models.FloatField(null=True, blank=True)  # Seconds from start of video
    video_file = models.FileField(upload_to='lesson_intro_videos/')  # Store videos in a 'videos' folder
    language = models.CharField(max_length=50, default='English')

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Intro Video for {self.lesson.title}"







class LessonInsertVideo(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='insert_videos', on_delete=models.CASCADE)
    subtitles_url = models.URLField(null=True, blank=True)  # Optional for subtitles
    duration = models.FloatField(null=True, blank=True)  # Seconds from start of video
    video_file = models.FileField(upload_to='lesson_insert_videos/')  # Store videos in a 'videos' folder
    language = models.CharField(max_length=50, default='English')
    timestamp = models.FloatField(null=True, blank=True)  # Seconds from start of video

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Insert Video for {self.lesson.title}"



class LessonInsertOutput(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='insert_output', on_delete=models.CASCADE)
    subtitles_url = models.URLField(null=True, blank=True)  # Optional for subtitles
    content = models.TextField(null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)  # Seconds from start of video
    window_position = models.JSONField(default=dict)
    window_dimension = models.JSONField(default=dict)
    timestamp = models.FloatField()  # Seconds from start of video

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Insert Output for {self.lesson.title}"





class LessonVideo(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='videos', on_delete=models.CASCADE)
    video_url = models.URLField(null=True, blank=True)
    subtitles_url = models.URLField(null=True, blank=True)  # Optional for subtitles
    duration = models.FloatField(null=True, blank=True)  # Seconds from start of video
    video_file = models.FileField(upload_to='lesson_videos/')  # Store videos in a 'videos' folder
    language = models.CharField(max_length=50, default='English')

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video for {self.lesson.title}"




class LessonCodeSnippet(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='snippets', on_delete=models.CASCADE)

    timestamp = models.FloatField()  # Seconds from start of video
    code_content = models.TextField()  # Full code at this timestamp
    cursor_position = models.JSONField(default=dict)  # e.g. {"line": 10, "column": 15}
    scroll_position = models.JSONField(default=dict)  # e.g. {"scrollTop": 0, "scrollLeft": 0}
    is_highlight = models.BooleanField(default=False)
    
    output = models.TextField(null=True, blank=True)


    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Snippet for {self.lesson.title} at {self.timestamp}s"








class LessonAssignment(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='lesson_assignments', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    instructions = models.TextField()
    expected_output = models.TextField(null=True, blank=True)
    code_template = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title






class CodingChallenge(models.Model):
    course = models.ForeignKey(Course, related_name='coding_challenge', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    instructions = models.TextField()
    expected_output = models.TextField(null=True, blank=True)
    code_template = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title





class ChallengeBadge(models.Model):
    badge_name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='badges/')
    criteria = models.TextField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)







class Motivation(models.Model):
    motivation = models.TextField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

