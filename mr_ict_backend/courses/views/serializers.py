
from rest_framework import serializers

from courses.models import (
    ChallengeBadge,
    CodingChallenge,
    Course,
    CourseInstructor,
    Lesson,
    LessonAssignment,
    LessonCodeSnippet,
    LessonInsertOutput,
    LessonInsertVideo,
    LessonIntroVideo,
    LessonVersionMarker,
    LessonVideo,
)


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


# New serializers for Week 2 models

class CourseInstructorSerializer(serializers.ModelSerializer):
    """Serializer for course instructors with user details."""
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    instructor_email = serializers.EmailField(source='instructor.email', read_only=True)
    instructor_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseInstructor
        fields = [
            'id',
            'instructor',
            'instructor_name',
            'instructor_email',
            'instructor_photo',
            'order',
            'role',
            'bio',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_instructor_photo(self, obj):
        if obj.instructor.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.instructor.photo.url)
            return obj.instructor.photo.url
        return None


class LessonVersionMarkerSerializer(serializers.ModelSerializer):
    """Serializer for lesson version markers."""
    
    class Meta:
        model = LessonVersionMarker
        fields = [
            'id',
            'marker_id',
            'label',
            'timecode',
            'position',
            'marker_type',
            'description',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['marker_id', 'created_at', 'updated_at']


class LessonSerializer(serializers.ModelSerializer):
    """Enhanced lesson serializer with new fields."""
    version_markers = LessonVersionMarkerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'lesson_id',
            'title',
            'description',
            'content',
            'video_url',
            'lesson_type',
            'order',
            'duration_seconds',
            'thumbnail',
            'version_markers',
            'is_archived',
            'active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['lesson_id', 'created_at', 'updated_at']


