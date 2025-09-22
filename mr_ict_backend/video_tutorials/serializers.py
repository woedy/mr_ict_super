from rest_framework import serializers
from .models import Project, ProjectFile, Recording, CodeSnapshotRecording


class RecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ["id", "title", "description", "video_file", "duration", "created_at"]

class AllRecordingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ["id", "title", "video_file", "duration"]
        

class CodeSnapshotRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSnapshotRecording
        fields = [
            "id",
            "timestamp",
            "code_content",
            "cursor_position",
            "scroll_position",
            "is_highlight",
            "created_at",
        ]


class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = ['id', 'file_type', 'content', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    files = ProjectFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'files']