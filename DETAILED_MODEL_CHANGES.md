# Detailed Model Changes Required
**Backend Model Modifications for UI Alignment**

---

## 1. STUDENT MODEL ENHANCEMENTS

### File: `mr_ict_backend/students/models.py`

```python
# ADD these fields to Student model:

class Student(models.Model):
    # ... existing fields ...
    
    # NEW FIELDS FOR ONBOARDING & ENGAGEMENT
    streak_days = models.IntegerField(default=0, help_text="Consecutive days of activity")
    last_activity_date = models.DateField(null=True, blank=True)
    availability = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Preferred learning time (e.g., 'Evenings & weekends')"
    )
    learning_goals = models.TextField(
        blank=True,
        help_text="Student's learning objectives"
    )
    preferred_mode = models.CharField(
        max_length=20,
        choices=[
            ('online', 'Online'),
            ('offline', 'Offline'),
            ('hybrid', 'Hybrid'),
        ],
        default='hybrid',
        help_text="Preferred learning mode"
    )
    
    # CONSIDER RENAMING (optional but recommended)
    # epz -> xp for clarity
```

**Migration Command:**
```bash
python manage.py makemigrations students
python manage.py migrate students
```

---

## 2. COURSE MODEL ENHANCEMENTS

### File: `mr_ict_backend/courses/models.py`

```python
# ADD these fields to Course model:

class Course(PublishableModel):
    # ... existing fields ...
    
    # NEW FIELDS FOR UI DISPLAY
    subtitle = models.CharField(
        max_length=500,
        blank=True,
        help_text="Short engaging subtitle for course cards"
    )
    track = models.CharField(
        max_length=50,
        choices=[
            ('Web', 'Web Development'),
            ('Data', 'Data Science'),
            ('Design', 'Design'),
        ],
        blank=True,
        help_text="Learning track/pathway"
    )
    spotlight = models.TextField(
        blank=True,
        help_text="Key selling point or highlight for the course"
    )
```

### NEW MODEL: CourseInstructor

```python
class CourseInstructor(models.Model):
    """Links instructors to courses with additional metadata"""
    course = models.ForeignKey(
        Course,
        related_name='course_instructors',
        on_delete=models.CASCADE
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='teaching_courses',
        on_delete=models.CASCADE
    )
    role = models.CharField(
        max_length=100,
        default='Instructor',
        help_text="e.g., Lead Instructor, Teaching Assistant"
    )
    bio = models.TextField(
        blank=True,
        help_text="Instructor bio specific to this course"
    )
    avatar_override = models.ImageField(
        upload_to='instructor_avatars/',
        null=True,
        blank=True,
        help_text="Optional custom avatar for this course"
    )
    order = models.PositiveIntegerField(default=1)
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'id']
        unique_together = ('course', 'instructor')
    
    def __str__(self):
        return f"{self.instructor.get_full_name()} - {self.course.title}"
```

---

## 3. LESSON MODEL ENHANCEMENTS

### File: `mr_ict_backend/courses/models.py`

```python
# ADD to Lesson model:

class Lesson(PublishableModel):
    # ... existing fields ...
    
    # NEW FIELD FOR LESSON TYPE
    lesson_type = models.CharField(
        max_length=20,
        choices=[
            ('video', 'Video'),
            ('project', 'Project'),
            ('quiz', 'Quiz'),
            ('reflection', 'Reflection'),
        ],
        default='video',
        help_text="Type of lesson content"
    )
```

### NEW MODEL: LessonVersionMarker

```python
class LessonVersionMarker(models.Model):
    """Timeline markers for Scrimba-style lesson playback"""
    lesson = models.ForeignKey(
        Lesson,
        related_name='version_markers',
        on_delete=models.CASCADE
    )
    marker_id = models.CharField(
        max_length=100,
        help_text="Unique identifier for this marker"
    )
    label = models.CharField(
        max_length=255,
        help_text="Display label (e.g., 'Layout inspiration')"
    )
    timecode = models.CharField(
        max_length=10,
        help_text="Display timecode (e.g., '02:05')"
    )
    position = models.FloatField(
        help_text="Position as percentage (0-100)"
    )
    marker_type = models.CharField(
        max_length=20,
        choices=[
            ('commit', 'Commit'),
            ('comment', 'Comment'),
            ('checkpoint', 'Checkpoint'),
        ],
        default='commit'
    )
    order = models.PositiveIntegerField(default=1)
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'position']
        unique_together = ('lesson', 'marker_id')
    
    def __str__(self):
        return f"{self.lesson.title} - {self.label} ({self.timecode})"
```

### ENHANCE: LessonCodeSnippet

```python
# ADD these fields to LessonCodeSnippet:

class LessonCodeSnippet(models.Model):
    # ... existing fields ...
    
    # NEW FIELDS FOR MULTI-FILE SUPPORT
    file_name = models.CharField(
        max_length=255,
        default='index.html',
        help_text="Name of the file (e.g., 'index.html', 'styles.css')"
    )
    file_type = models.CharField(
        max_length=20,
        choices=[
            ('html', 'HTML'),
            ('css', 'CSS'),
            ('javascript', 'JavaScript'),
            ('markdown', 'Markdown'),
        ],
        default='html',
        help_text="Type of code file"
    )
```

---

## 4. ASSESSMENT MODEL ENHANCEMENTS

### File: `mr_ict_backend/assessments/models.py`

```python
# ADD to Assessment model:

class Assessment(models.Model):
    # ... existing fields ...
    
    # NEW FIELDS FOR UI DISPLAY
    assessment_type = models.CharField(
        max_length=30,
        choices=[
            ('checkpoint', 'Checkpoint'),
            ('capstone', 'Capstone'),
            ('sprint_challenge', 'Sprint Challenge'),
        ],
        default='checkpoint',
        help_text="Type of assessment"
    )
    focus_area = models.CharField(
        max_length=255,
        blank=True,
        help_text="Main topic or skill being assessed"
    )
```

---

## 5. SCHOOL MODEL ENHANCEMENTS

### File: `mr_ict_backend/schools/models.py`

```python
# ADD to School model:

class School(models.Model):
    # ... existing fields ...
    
    # NEW FIELDS FOR ADMIN UI
    school_type = models.CharField(
        max_length=20,
        choices=[
            ('JHS', 'Junior High School'),
            ('SHS', 'Senior High School'),
            ('University', 'University'),
            ('Technical', 'Technical Institute'),
        ],
        blank=True,
        help_text="Type of educational institution"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('pending', 'Pending'),
        ],
        default='pending',
        help_text="School account status"
    )
    principal = models.CharField(
        max_length=255,
        blank=True,
        help_text="Name of school principal/head"
    )
    joined_date = models.DateTimeField(
        auto_now_add=True,
        help_text="Date school joined platform"
    )
```

---

## 6. NEW ENGAGEMENT MODELS

### File: `mr_ict_backend/students/models.py` (or new `engagement` app)

```python
class DailyFocus(models.Model):
    """Daily motivational content for students"""
    student = models.ForeignKey(
        Student,
        related_name='daily_focus',
        on_delete=models.CASCADE
    )
    date = models.DateField(auto_now_add=True)
    win = models.TextField(
        help_text="Today's achievement/win"
    )
    intention = models.TextField(
        help_text="Focus area for the day"
    )
    encouragement = models.TextField(
        help_text="Motivational message"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ('student', 'date')
    
    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.date}"


class LiveSession(models.Model):
    """Live learning sessions/webinars"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='live_sessions',
        on_delete=models.SET_NULL,
        null=True
    )
    course = models.ForeignKey(
        'courses.Course',
        related_name='live_sessions',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    scheduled_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    meeting_url = models.URLField(blank=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_time']
    
    def __str__(self):
        return f"{self.title} - {self.scheduled_time}"


class OfflineContentPack(models.Model):
    """Downloadable content packs for offline learning"""
    student = models.ForeignKey(
        Student,
        related_name='offline_packs',
        on_delete=models.CASCADE
    )
    course = models.ForeignKey(
        'courses.Course',
        related_name='offline_packs',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    size_mb = models.FloatField(help_text="Pack size in megabytes")
    download_url = models.URLField(blank=True)
    downloaded_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    is_synced = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.title}"
```

---

## 7. NEW COMMUNITY MODELS

### File: `mr_ict_backend/community/models.py` (new app)

```python
from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class CommunityThread(models.Model):
    """Discussion threads for community"""
    title = models.CharField(max_length=255)
    body = models.TextField()
    author = models.ForeignKey(
        User,
        related_name='community_threads',
        on_delete=models.CASCADE
    )
    course = models.ForeignKey(
        'courses.Course',
        related_name='community_threads',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    tags = models.JSONField(default=list, blank=True)
    is_pinned = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_pinned', '-last_activity_at']
    
    def __str__(self):
        return self.title
    
    @property
    def reply_count(self):
        return self.replies.count()


class ThreadReply(models.Model):
    """Replies to community threads"""
    thread = models.ForeignKey(
        CommunityThread,
        related_name='replies',
        on_delete=models.CASCADE
    )
    author = models.ForeignKey(
        User,
        related_name='thread_replies',
        on_delete=models.CASCADE
    )
    body = models.TextField()
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='child_replies',
        on_delete=models.CASCADE
    )
    likes = models.ManyToManyField(
        User,
        related_name='liked_thread_replies',
        blank=True
    )
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply by {self.author.get_full_name()} on {self.thread.title}"
    
    @property
    def like_count(self):
        return self.likes.count()
```

---

## 8. NEW RECORDING STUDIO MODEL

### File: `mr_ict_backend/courses/models.py` or new `recording` app

```python
class LessonRecording(models.Model):
    """Recordings for lesson content creation"""
    title = models.CharField(max_length=255)
    course = models.ForeignKey(
        'courses.Course',
        related_name='recordings',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    lesson = models.ForeignKey(
        'courses.Lesson',
        related_name='recordings',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('recording', 'Recording'),
            ('processing', 'Processing'),
            ('published', 'Published'),
            ('failed', 'Failed'),
        ],
        default='recording'
    )
    video_file = models.FileField(
        upload_to='lesson_recordings/',
        null=True,
        blank=True
    )
    duration_seconds = models.PositiveIntegerField(default=0)
    processing_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Processing status, errors, etc."
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='lesson_recordings',
        on_delete=models.SET_NULL,
        null=True
    )
    
    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.status}"
```

---

## 9. USER MODEL ENHANCEMENT

### File: `mr_ict_backend/accounts/models.py`

```python
# ADD to User model:

class User(AbstractBaseUser):
    # ... existing fields ...
    
    # NEW FIELD FOR ADMIN MANAGEMENT
    account_status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('suspended', 'Suspended'),
        ],
        default='active',
        help_text="Account status for admin management"
    )
```

---

## 10. MIGRATION CHECKLIST

### Step-by-step migration process:

1. **Backup database**
   ```bash
   python manage.py dumpdata > backup_before_alignment.json
   ```

2. **Create migrations for each app**
   ```bash
   python manage.py makemigrations students
   python manage.py makemigrations courses
   python manage.py makemigrations assessments
   python manage.py makemigrations schools
   python manage.py makemigrations accounts
   ```

3. **Create new apps if needed**
   ```bash
   python manage.py startapp community
   python manage.py startapp engagement
   ```

4. **Review migrations**
   ```bash
   python manage.py showmigrations
   ```

5. **Apply migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create default data**
   ```bash
   python manage.py shell
   # Create default DailyFocus entries, etc.
   ```

---

## 11. SERIALIZER UPDATES NEEDED

After model changes, update serializers in each app's `api/serializers.py`:

- `StudentSerializer` - add new fields
- `CourseSerializer` - add nested `CourseInstructorSerializer`
- `LessonSerializer` - add `lesson_type`, nested `LessonVersionMarkerSerializer`
- `AssessmentSerializer` - add new fields
- `SchoolSerializer` - add new fields
- Create new serializers for new models

---

## SUMMARY

**Total New Fields:** ~25
**New Models:** 7
**Enhanced Models:** 8
**Estimated Migration Time:** 2-3 hours
**Testing Time:** 4-6 hours

**Risk Level:** Low-Medium (mostly additive changes)
