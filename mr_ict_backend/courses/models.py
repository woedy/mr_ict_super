from django.apps import apps
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models.signals import pre_save
from django.utils import timezone
from django.utils.text import slugify

from core.utils import unique_course_id_generator, unique_lesson_id_generator


class PublishStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    IN_REVIEW = "in_review", "In review"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class PublishableModel(models.Model):
    """Shared fields and helpers for content that moves through review states."""

    status = models.CharField(
        max_length=32,
        choices=PublishStatus.choices,
        default=PublishStatus.DRAFT,
    )
    review_notes = models.TextField(blank=True)
    submitted_for_review_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def _transition(self, new_status: str, *, performed_by=None, notes: str | None = None) -> None:
        """Update status timestamps and emit an audit log."""

        if new_status == self.status and (notes is None or notes == self.review_notes):
            return

        previous_status = self.status
        now = timezone.now()
        update_fields = ["status", "updated_at"] if hasattr(self, "updated_at") else ["status"]

        self.status = new_status
        if new_status == PublishStatus.IN_REVIEW:
            self.submitted_for_review_at = now
            update_fields.append("submitted_for_review_at")
        elif new_status == PublishStatus.PUBLISHED:
            self.published_at = now
            update_fields.append("published_at")
        elif new_status in {PublishStatus.DRAFT, PublishStatus.ARCHIVED}:
            # Reset publish metadata when reverting
            if self.published_at is not None:
                self.published_at = None
                update_fields.append("published_at")

        if notes is not None:
            self.review_notes = notes
            update_fields.append("review_notes")

        self.save(update_fields=update_fields)

        ContentAuditLog = apps.get_model("courses", "ContentAuditLog")
        ContentAuditLog.log_transition(
            content_object=self,
            performed_by=performed_by,
            from_status=previous_status,
            to_status=new_status,
            notes=notes,
        )

    def mark_in_review(self, *, performed_by=None, notes: str | None = None) -> None:
        self._transition(PublishStatus.IN_REVIEW, performed_by=performed_by, notes=notes)

    def mark_published(self, *, performed_by=None, notes: str | None = None) -> None:
        self._transition(PublishStatus.PUBLISHED, performed_by=performed_by, notes=notes)

    def mark_draft(self, *, performed_by=None, notes: str | None = None) -> None:
        self._transition(PublishStatus.DRAFT, performed_by=performed_by, notes=notes)

    def mark_archived(self, *, performed_by=None, notes: str | None = None) -> None:
        self._transition(PublishStatus.ARCHIVED, performed_by=performed_by, notes=notes)



class Course(PublishableModel):
    course_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    title = models.CharField(max_length=1000, unique=True)
    summary = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="course_images/", blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    level = models.CharField(max_length=50, blank=True)
    estimated_duration_minutes = models.PositiveIntegerField(default=0)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="authored_courses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="updated_courses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.course_id:
            self.course_id = unique_course_id_generator(self)
        if not self.slug:
            base_slug = slugify(self.title) or unique_course_id_generator(self)
            slug = base_slug
            idx = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                idx += 1
                slug = f"{base_slug}-{idx}"
            self.slug = slug
        super().save(*args, **kwargs)


def pre_save_course_id_receiver(sender, instance, *args, **kwargs):
    if not instance.course_id:
        instance.course_id = unique_course_id_generator(instance)

pre_save.connect(pre_save_course_id_receiver, sender=Course)




class Module(PublishableModel):
    course = models.ForeignKey(Course, related_name="modules", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="authored_modules",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="updated_modules",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("course", "title")

    def __str__(self):
        return f"{self.course.title} • {self.title}"




class Lesson(PublishableModel):
    lesson_id = models.CharField(max_length=1000, unique=True)
    course = models.ForeignKey(Course, related_name="lessons", on_delete=models.CASCADE, null=True, blank=True)
    module = models.ForeignKey(Module, related_name="lessons", on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    order = models.IntegerField()

    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    thumbnail = models.ImageField(upload_to="lesson_thumbnails/", null=True, blank=True)


    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
        unique_together = ("module", "title")

    def save(self, *args, **kwargs):
        if self.module and not self.course:
            self.course = self.module.course
        if not self.lesson_id:
            self.lesson_id = unique_lesson_id_generator(self)
        super().save(*args, **kwargs)



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
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    instructions = models.TextField()
    expected_output = models.TextField(null=True, blank=True)
    code_template = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    entrypoint_filename = models.CharField(max_length=255, default='main.py')
    starter_files = models.JSONField(default=list, blank=True)
    solution_files = models.JSONField(default=list, blank=True)
    hints = models.JSONField(default=list, blank=True)
    test_cases = models.JSONField(default=list, blank=True)
    time_limit_seconds = models.PositiveIntegerField(default=5)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify

            base_slug = slugify(self.title) or 'challenge'
            candidate = base_slug
            counter = 1
            while CodingChallenge.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                counter += 1
                candidate = f"{base_slug}-{counter}"
            self.slug = candidate
        super().save(*args, **kwargs)

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


class ContentAuditLog(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="content_audit_logs",
    )
    from_status = models.CharField(max_length=32, choices=PublishStatus.choices)
    to_status = models.CharField(max_length=32, choices=PublishStatus.choices)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    @classmethod
    def log_transition(
        cls,
        *,
        content_object,
        performed_by=None,
        from_status: str,
        to_status: str,
        notes: str | None = None,
    ) -> None:
        cls.objects.create(
            content_object=content_object,
            performed_by=performed_by,
            from_status=from_status,
            to_status=to_status,
            notes=notes or "",
        )

