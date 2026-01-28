import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, pre_save
from django.utils import timezone

from core.utils import unique_student_id_generator
from courses.models import ChallengeBadge, LessonCodeSnippet, CodingChallenge, Course, Lesson
from schools.models import School

User = get_user_model()

PREFERRED_MODE_CHOICES = (
    ('online', 'Online'),
    ('offline', 'Offline'),
    ('hybrid', 'Hybrid'),
)

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='student')
    school = models.ForeignKey(School, related_name='students', on_delete=models.CASCADE)

    epz = models.IntegerField(default=0)
    track = models.CharField(max_length=500, default="Full Stack Web Dev")
    progress = models.IntegerField(default=0)
    challenges_solved = models.IntegerField(default=0)
    days_active = models.IntegerField(default=0)
    
    # New fields for Week 2
    streak_days = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    availability = models.CharField(max_length=100, blank=True)
    learning_goals = models.TextField(blank=True)
    preferred_mode = models.CharField(max_length=20, choices=PREFERRED_MODE_CHOICES, default='hybrid', blank=True)
    
    preferred_language = models.CharField(max_length=32, blank=True)
    accessibility_preferences = models.JSONField(default=list, blank=True)
    interest_tags = models.JSONField(default=list, blank=True)
    allow_offline_downloads = models.BooleanField(default=True)
    has_completed_onboarding = models.BooleanField(default=False)
    onboarding_completed_at = models.DateTimeField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)



def pre_save_student_id_receiver(sender, instance, *args, **kwargs):
    if not instance.student_id:
        instance.student_id = unique_student_id_generator(instance)

pre_save.connect(pre_save_student_id_receiver, sender=Student)


class StudentXPEvent(models.Model):
    SOURCE_ASSESSMENT = "assessment"
    SOURCE_CHALLENGE = "challenge"
    SOURCE_MANUAL = "manual"

    SOURCE_CHOICES = (
        (SOURCE_ASSESSMENT, "Assessment"),
        (SOURCE_CHALLENGE, "Challenge"),
        (SOURCE_MANUAL, "Manual"),
    )

    student = models.ForeignKey(Student, related_name='xp_events', on_delete=models.CASCADE)
    source = models.CharField(max_length=32, choices=SOURCE_CHOICES)
    reference = models.CharField(max_length=255, blank=True)
    amount = models.IntegerField()
    balance_after = models.IntegerField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.amount} XP"


LEVEL = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )
    

class StudentLevel(models.Model):
    student = models.ForeignKey(Student, related_name='level', on_delete=models.CASCADE)
    Level = models.CharField(max_length=200, choices=LEVEL, default="Beginner", null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)




class StudentCodingChallengeState(models.Model):
    student = models.ForeignKey(Student, related_name='coding_states', on_delete=models.CASCADE)
    challenge = models.ForeignKey(CodingChallenge, related_name='student_states', on_delete=models.CASCADE)
    files = models.JSONField(default=list, blank=True)
    hints_revealed = models.PositiveIntegerField(default=0)
    last_hint_requested_at = models.DateTimeField(null=True, blank=True)
    last_run_result = models.JSONField(default=dict, blank=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'challenge')


class StudentProject(models.Model):
    project_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    student = models.ForeignKey(Student, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    files = models.JSONField(default=list, blank=True)
    validation_schema = models.JSONField(default=dict, blank=True)
    last_validation_result = models.JSONField(default=dict, blank=True)
    last_validated_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-updated_at']




class StudentCourse(models.Model):
    student = models.ForeignKey(Student, related_name='student_courses', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='courses', on_delete=models.CASCADE)

    completed = models.BooleanField(default=False)
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    progress_percent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    level = models.IntegerField(default=0)

    last_seen = models.DateTimeField()

    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.student.user.last_name} - {self.course.title}"



class StudentLesson(models.Model):
    course = models.ForeignKey(StudentCourse, related_name='course_lesson', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name='lesson', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    resume_code = models.ForeignKey(
        LessonCodeSnippet,
        related_name='resume_code',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    last_position_seconds = models.FloatField(default=0)
    last_viewed_at = models.DateTimeField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)





class LessonNote(models.Model):
    lesson = models.ForeignKey(StudentLesson, related_name='student_lesson_notes', on_delete=models.CASCADE)
    note = models.TextField(null=True, blank=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)





class LessonNoteSnippet(models.Model):
    note = models.ForeignKey(StudentLesson, related_name='note_snippet', on_delete=models.CASCADE)
    snippet_interacted_with = models.ForeignKey(LessonCodeSnippet, related_name='code_snippet', on_delete=models.CASCADE)
    edited_code_content = models.TextField()

    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)



class LessonFeedback(models.Model):
    lesson = models.ForeignKey(StudentLesson, related_name='feedback', on_delete=models.CASCADE)
    feedback_text = models.TextField()

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Feedback for {self.lesson.title} by {self.student.username}"



class StudentLessonAssignment(models.Model):
    lesson = models.ForeignKey(StudentLesson, related_name='lesson_assignment', on_delete=models.CASCADE)
    question_text = models.TextField()
    result_text = models.TextField()

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Assignment for {self.lesson.title} by {self.student.username}"







class ResumeLeaning(models.Model):
    student = models.ForeignKey(Student, related_name='resume', on_delete=models.CASCADE)
    lesson = models.ForeignKey(StudentLesson, related_name='resume_leaning', on_delete=models.CASCADE)
    timestamp = models.TextField()

    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"








class StudentChallenge(models.Model):
    student = models.ForeignKey(Student, related_name='challenges', on_delete=models.CASCADE)
    challenge = models.ForeignKey(CodingChallenge, related_name='student_challenges', on_delete=models.CASCADE)

    completed = models.BooleanField(default=False)

    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)









class StudentBadge(models.Model):
    student = models.ForeignKey(Student, related_name='badges', on_delete=models.CASCADE)
    badge = models.ForeignKey(ChallengeBadge, related_name='badge', on_delete=models.CASCADE)
    coding_challenge = models.ForeignKey(CodingChallenge, related_name='challenge', on_delete=models.CASCADE)

    earned_at = models.DateTimeField(auto_now_add=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)




class StudentCertificate(models.Model):
    student = models.ForeignKey(Student, related_name='certificates', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='student_certificates', on_delete=models.CASCADE, null=True, blank=True)
    assessment = models.ForeignKey(
        'assessments.Assessment',
        related_name='student_certificates',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    issued_by = models.CharField(max_length=255, blank=True)
    download_url = models.URLField(blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-issued_at']
        unique_together = ("student", "assessment", "course", "title")

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.title}"


class StudentActivity(models.Model):
    student = models.ForeignKey(Student, related_name='student_activities', on_delete=models.CASCADE)
    action = models.CharField(max_length=1000, null=True, blank=True)
    name = models.CharField(max_length=1000, null=True, blank=True)


    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)


    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)




class LessonComment(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='lesson_comments', on_delete=models.CASCADE)
    student = models.ForeignKey(Student, related_name='lesson_comments', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    body = models.TextField()
    likes = models.ManyToManyField(User, related_name='liked_lesson_comments', blank=True)
    is_pinned = models.BooleanField(default=False)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"Comment by {self.student.user.get_full_name()} on {self.lesson.title}"

    @property
    def like_count(self):
        return self.likes.count()


class StudentMessage(models.Model):
    message = models.TextField(null=True, blank=True)
    read = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="student_messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="message_sender")


    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



