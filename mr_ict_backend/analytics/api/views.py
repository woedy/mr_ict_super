from __future__ import annotations

from dataclasses import asdict

from django.http import HttpResponse
from django.utils import timezone
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from analytics.api.serializers import AdminSummarySerializer, LearningEventCreateSerializer
from analytics.models import LearningEvent
from analytics.services import (
    admin_summary_as_csv,
    build_admin_summary,
    record_event,
)
from assessments.models import Assessment
from courses.models import Course, Lesson


class LearningEventIngestView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LearningEventCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        student = getattr(request.user, "student", None)
        course = None
        lesson = None
        assessment = None

        course_id = data.get("course_id")
        if course_id:
            course = Course.objects.filter(course_id=course_id).first()
        lesson_id = data.get("lesson_id")
        if lesson_id:
            lesson = Lesson.objects.filter(lesson_id=lesson_id).first()
        assessment_slug = data.get("assessment_slug")
        if assessment_slug:
            assessment = Assessment.objects.filter(slug=assessment_slug).first()

        occurred_at = data.get("occurred_at") or timezone.now()

        event = record_event(
            event_type=data["event_type"],
            user=request.user,
            student=student,
            course=course,
            lesson=lesson,
            assessment=assessment,
            source=data.get("source", LearningEvent.SOURCE_FRONTEND),
            occurred_at=occurred_at,
            metadata=data.get("metadata"),
        )
        return Response({"message": "Recorded", "data": {"id": event.id}})


class AdminAnalyticsSummaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        summary = build_admin_summary()
        if request.query_params.get("format") == "csv":
            csv_payload = admin_summary_as_csv(summary)
            response = HttpResponse(csv_payload, content_type="text/csv")
            response["Content-Disposition"] = "attachment; filename=analytics-summary.csv"
            return response

        serializer = AdminSummarySerializer(data=asdict(summary))
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Successful", "data": serializer.data})


class AdminAnalyticsSummaryExportView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        summary = build_admin_summary()
        csv_payload = admin_summary_as_csv(summary)
        response = HttpResponse(csv_payload, content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=analytics-summary.csv"
        return response
