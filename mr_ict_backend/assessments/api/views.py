from __future__ import annotations

from datetime import datetime

from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from analytics.models import LearningEvent
from analytics.services import record_event
from assessments.api.serializers import (
    AssessmentAttemptResultSerializer,
    AssessmentAttemptSerializer,
    AssessmentDetailSerializer,
    AssessmentSummarySerializer,
)
from assessments.models import Assessment, Question, StudentQuizAttempt
from assessments.services import grade_assessment
from courses.models import PublishStatus
from students.api.views import StudentExperienceBaseView
from students.services.progression import process_assessment_rewards


class StudentAssessmentListView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = self.get_student(request)
        queryset = (
            Assessment.objects.filter(
                is_archived=False,
                active=True,
                lesson__status=PublishStatus.PUBLISHED,
                lesson__course__status=PublishStatus.PUBLISHED,
            )
            .select_related("lesson", "lesson__course")
            .prefetch_related(
                Prefetch(
                    "questions",
                    queryset=Question.objects.filter(
                        is_archived=False,
                        active=True,
                    ),
                )
            )
            .order_by("lesson__course__title", "title")
        )
        serializer = AssessmentSummarySerializer(queryset, many=True, context={"request": request, "student": student})
        return Response({"message": "Successful", "data": serializer.data})


class StudentAssessmentDetailView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, slug: str):
        student = self.get_student(request)
        assessment = get_object_or_404(
            Assessment.objects.select_related("lesson", "lesson__course").prefetch_related(
                "questions",
            ),
            slug=slug,
            is_archived=False,
            active=True,
        )
        serializer = AssessmentDetailSerializer(assessment, context={"request": request, "student": student})
        return Response({"message": "Successful", "data": serializer.data})


class StudentAssessmentAttemptView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, slug: str):
        student = self.get_student(request)
        assessment = get_object_or_404(
            Assessment.objects.select_related("lesson", "lesson__course").prefetch_related("questions"),
            slug=slug,
            is_archived=False,
            active=True,
        )

        serializer = AssessmentAttemptSerializer(
            data=request.data,
            context={"assessment": assessment, "student": student},
        )
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        grading_result = grade_assessment(assessment, answers)

        started_at: datetime | None = None
        if serializer.validated_data.get("started_at"):
            started_at = serializer.validated_data["started_at"]
        else:
            started_raw = request.data.get("started_at")
            if started_raw:
                started_at = parse_datetime(str(started_raw))
        if started_at is None:
            started_at = grading_result.completed_at
        duration_seconds = int(
            max(0, (grading_result.completed_at - started_at).total_seconds())
        )

        status_value = StudentQuizAttempt.PASSED if grading_result.passed else StudentQuizAttempt.FAILED
        rewards = process_assessment_rewards(student=student, assessment=assessment)

        feedback_messages = [result.feedback for result in grading_result.question_results if result.feedback]
        feedback_text = "\n".join(feedback_messages)

        attempt = StudentQuizAttempt.objects.create(
            student=student,
            assessment=assessment,
            answers=answers,
            score=grading_result.earned_points,
            percentage_score=grading_result.percentage,
            status=status_value,
            awarded_xp=rewards.xp_awarded,
            feedback=feedback_text,
            duration_seconds=duration_seconds,
            active=True,
            is_archived=False,
            started_at=started_at,
            completed_at=grading_result.completed_at,
        )

        attempts_remaining = 0
        if assessment.max_attempts:
            attempts_used = StudentQuizAttempt.objects.filter(student=student, assessment=assessment).count()
            attempts_remaining = max(0, assessment.max_attempts - attempts_used)

        badge_payload = None
        if rewards.badge_awarded and rewards.badge_awarded.badge:
            badge_payload = {
                "id": rewards.badge_awarded.pk,
                "name": rewards.badge_awarded.badge.badge_name,
                "criteria": rewards.badge_awarded.badge.criteria,
                "image": request.build_absolute_uri(rewards.badge_awarded.badge.image.url)
                if rewards.badge_awarded.badge.image
                else None,
            }

        certificate_payload = None
        if rewards.certificate_awarded:
            certificate_payload = {
                "id": rewards.certificate_awarded.pk,
                "title": rewards.certificate_awarded.title,
                "issued_at": rewards.certificate_awarded.issued_at,
                "issued_by": rewards.certificate_awarded.issued_by,
                "download_url": rewards.certificate_awarded.download_url,
            }

        result_payload = {
            "score": grading_result.earned_points,
            "percentage": grading_result.percentage,
            "status": attempt.status,
            "awarded_xp": attempt.awarded_xp,
            "attempts_remaining": attempts_remaining,
            "certificate": certificate_payload,
            "badge": badge_payload,
            "results": [
                {
                    "question_id": result.question_id,
                    "correct": result.correct,
                    "earned_points": result.earned_points,
                    "possible_points": result.possible_points,
                    "feedback": result.feedback,
                }
                for result in grading_result.question_results
            ],
        }

        response_serializer = AssessmentAttemptResultSerializer(data=result_payload)
        response_serializer.is_valid(raise_exception=True)
        record_event(
            event_type=LearningEvent.TYPE_ASSESSMENT_COMPLETED,
            user=request.user,
            student=student,
            course=assessment.lesson.course if assessment.lesson else None,
            lesson=assessment.lesson,
            assessment=assessment,
            metadata={
                "score": attempt.score,
                "percentage": attempt.percentage_score,
                "status": attempt.status,
                "awarded_xp": attempt.awarded_xp,
                "duration_seconds": duration_seconds,
            },
        )
        return Response({"message": "Successful", "data": response_serializer.data}, status=status.HTTP_201_CREATED)
