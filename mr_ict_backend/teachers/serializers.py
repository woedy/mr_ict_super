from rest_framework import serializers
from .models import Teacher


class AllTeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"

class TeacherDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"
