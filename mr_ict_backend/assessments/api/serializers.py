from __future__ import annotations

from typing import Any, Dict

from rest_framework import serializers

from assessments.models import Assessment, Question, StudentQuizAttempt


class AssessmentQuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "question_type",
            "options",
            "order",
            "points",
        ]

    def get_options(self, obj: Question) -> Any:
        if obj.question_type == Question.MULTIPLE_CHOICE:
            return obj.options or []
        return None


class AssessmentSummarySerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)
    course_title = serializers.CharField(source="lesson.course.title", read_only=True)
    attempts_used = serializers.SerializerMethodField()
    attempts_remaining = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Assessment
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "tags",
            "lesson_title",
            "course_title",
            "passing_score",
            "time_limit_seconds",
            "max_attempts",
            "is_practice",
            "reward_xp",
            "issues_certificate",
            "available_from",
            "available_until",
            "attempts_used",
            "attempts_remaining",
            "is_available",
        ]

    def _get_student_attempts(self, obj: Assessment) -> int:
        student = self.context.get("student")
        if not student:
            return 0
        return StudentQuizAttempt.objects.filter(student=student, assessment=obj).count()

    def get_attempts_used(self, obj: Assessment) -> int:
        return self._get_student_attempts(obj)

    def get_attempts_remaining(self, obj: Assessment) -> int:
        attempts_used = self._get_student_attempts(obj)
        if obj.max_attempts == 0:
            return 0
        remaining = obj.max_attempts - attempts_used
        return max(0, remaining)

    def get_is_available(self, obj: Assessment) -> bool:
        return obj.is_available()


class AssessmentDetailSerializer(AssessmentSummarySerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)

    class Meta(AssessmentSummarySerializer.Meta):
        fields = AssessmentSummarySerializer.Meta.fields + ["questions"]


class QuestionResultSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    correct = serializers.BooleanField()
    earned_points = serializers.IntegerField()
    possible_points = serializers.IntegerField()
    feedback = serializers.CharField(allow_blank=True)


class AssessmentAttemptResultSerializer(serializers.Serializer):
    score = serializers.IntegerField()
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    status = serializers.CharField()
    awarded_xp = serializers.IntegerField()
    attempts_remaining = serializers.IntegerField()
    certificate = serializers.DictField(child=serializers.CharField(), allow_null=True)
    badge = serializers.DictField(child=serializers.CharField(), allow_null=True)
    results = QuestionResultSerializer(many=True)


class AssessmentAttemptSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.JSONField())
    started_at = serializers.DateTimeField(required=False)

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        assessment: Assessment = self.context["assessment"]
        student = self.context["student"]

        attempts_used = StudentQuizAttempt.objects.filter(student=student, assessment=assessment).count()
        if assessment.max_attempts and attempts_used >= assessment.max_attempts:
            raise serializers.ValidationError("Maximum attempts reached for this assessment.")
        if not assessment.is_available():
            raise serializers.ValidationError("Assessment is not currently available.")
        if not attrs.get("answers"):
            raise serializers.ValidationError("Answers payload cannot be empty.")
        return attrs
