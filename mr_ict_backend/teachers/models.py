from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Lesson
from schools.models import School
from students.models import LessonFeedback, Student

User = get_user_model()

class Teacher(models.Model):
    school = models.ForeignKey(School, related_name='teachers', on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)




class Classroom(models.Model):
    teacher = models.ForeignKey(Teacher, related_name='classrooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)  # e.g., "Grade 9 Python Class"
    students = models.ManyToManyField(Student, related_name='classroom_students')
    class_code = models.CharField(max_length=20, unique=True)  # Unique class code

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)






class TeacherFeedback(models.Model):
    student_feedback = models.ForeignKey(LessonFeedback, related_name='feedbacks', on_delete=models.CASCADE)
    feedback = models.TextField()

    is_archived = models.BooleanField(default=False)
    active = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.student.user.first_name} on {self.lesson.title}"


