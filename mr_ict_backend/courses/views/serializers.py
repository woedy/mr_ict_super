
from rest_framework import serializers

from courses.models import ChallengeBadge, CodingChallenge, Course, LessonAssignment, LessonCodeSnippet, LessonInsertOutput, LessonInsertVideo, LessonIntroVideo, LessonVideo


class AllCoursesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = "__all__"


class CourseDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = "__all__"

class AllLessonIntroVideosSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonIntroVideo
        fields = "__all__"

class LessonIntroVideoDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonIntroVideo
        fields = "__all__"

class AllLessonVideosSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonVideo
        fields = "__all__"


class LessonVideoDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonVideo
        fields = "__all__"

        
class AllLessonInsertVideosSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonInsertVideo
        fields = "__all__"


class LessonInsertVideoDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonInsertVideo
        fields = "__all__"


class AllLessonInsertOutputsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonInsertOutput
        fields = "__all__"


class LessonInsertOutputDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonInsertOutput
        fields = "__all__"





class AllLessonCodeSnippetsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonCodeSnippet
        fields = "__all__"


class LessonCodeSnippetDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonCodeSnippet
        fields = "__all__"



class AllLessonAssignmentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonAssignment
        fields = "__all__"


class LessonAssignmentDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonAssignment
        fields = "__all__"




        

class AllCodingChallengesSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodingChallenge
        fields = "__all__"



class CodingChallengeDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodingChallenge
        fields = "__all__"


class AllChallengeBadgesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChallengeBadge
        fields = "__all__"



class ChallengeBadgeDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChallengeBadge
        fields = "__all__"


