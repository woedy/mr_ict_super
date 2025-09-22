
from rest_framework import serializers

from courses.models import CodingChallenge, Course
from students.models import StudentBadge, StudentLesson

class DashboardStudentBadgeSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentBadge
        fields = "__all__"

class DashboardStudentCourseLessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentLesson
        fields = "__all__"

class DashboardCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = "__all__"

class DashboardCodingChallengeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodingChallenge
        fields = "__all__"

