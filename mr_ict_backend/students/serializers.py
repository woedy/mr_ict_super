from rest_framework import serializers
from .models import LessonFeedback, LessonNote, Student, StudentCourse, StudentLesson


class AllStudentsSerializer(serializers.ModelSerializer):
    school_name = serializers.SerializerMethodField()
    school_logo = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    completed_courses = serializers.SerializerMethodField()
    active_lesson = serializers.SerializerMethodField()
    email = serializers.CharField(source="user.email", read_only=True)
    school_region = serializers.CharField(source="school.region", read_only=True)

    class Meta:
        model = Student
        fields = ["student_id", "full_name", "email", "photo", "epz", "completed_courses", "active_lesson", "school_name","school_region", 'progress', "school_logo"]

    def get_school_name(self, obj):
        return obj.school.name if obj.school else None
    
    def get_school_logo(self, obj):
        return obj.school.logo.url if obj.school else None
    
    def get_photo(self, obj):
        return obj.user.photo.url if obj.user else None
    
    def get_full_name(self, obj):
        full_name = None

        first_name = obj.user.first_name if obj.user else None
        last_name = obj.user.last_name if obj.user else None
        full_name = first_name + " " + last_name

        return full_name
    
    def get_completed_courses(self, obj):
        completed_count = 0

        completed_courses = obj.student_courses.filter(completed=True)
        completed_count = completed_courses.count()
        return completed_count
    

    
    def get_active_lesson(self, obj):
        title = None

        active_course = obj.student_courses.filter(active=True).first()
        act_les = StudentLesson.objects.filter(course=active_course).filter(active=True).first()
        if act_les:
            print(act_les.lesson.title)
            title = act_les.lesson.title

        return title






class StudentDetailsSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = Student
        fields = ['name']

    def get_full_name(self, obj):
        full_name = None

        first_name = obj.user.first_name if obj.user else None
        last_name = obj.user.last_name if obj.user else None
        full_name = first_name + " " + last_name

        return full_name



class AllStudentCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = "__all__"

class StudentCourseDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = "__all__"

class AllStudentLessonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLesson
        fields = "__all__"

class StudentLessonDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLesson
        fields = "__all__"

class AllLessonNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonNote
        fields = "__all__"

class LessonNoteDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonNote
        fields = "__all__"

class AllLessonFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonFeedback
        fields = "__all__"

class LessonFeedbackDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonFeedback
        fields = "__all__"
