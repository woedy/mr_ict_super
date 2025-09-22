
from rest_framework import serializers

from courses.models import Lesson, LessonIntroVideo, LessonVideo

class AllLessonsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = "__all__"


class LessonDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = "__all__"

        
class LessonIntroVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonIntroVideo
        fields = "__all__"


        
class LessonVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonVideo
        fields = "__all__"


