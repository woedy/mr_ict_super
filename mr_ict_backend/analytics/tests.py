from __future__ import annotations

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.urls import reverse
from django.utils import timezone
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from analytics.models import DailyEngagementSummary, LearningEvent
from analytics.services import backfill_daily_summaries, generate_daily_summary
from courses.models import Course, Lesson, Module, PublishStatus
from schools.models import School
from students.models import Student, StudentCourse, StudentLesson


class AnalyticsApiTests(APITestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.user = User.objects.create_user(
            email="student@example.com",
            password="password123",
            first_name="Ama",
            last_name="Mensah",
        )
        self.school = School.objects.create(
            school_id="SCH-001",
            name="Test School",
            region="Greater Accra",
            district="Accra",
            phone="1234567890",
            contact_person="Coordinator",
            contact_email="school@example.com",
        )
        self.student = Student.objects.create(user=self.user, school=self.school)

        self.course = Course.objects.create(
            title="Intro to Web",
            summary="Basics",
            description="",
            status=PublishStatus.PUBLISHED,
        )
        self.module = Module.objects.create(
            course=self.course,
            title="Module 1",
            order=1,
            status=PublishStatus.PUBLISHED,
        )
        self.lesson = Lesson.objects.create(
            course=self.course,
            module=self.module,
            title="Lesson 1",
            order=1,
            status=PublishStatus.PUBLISHED,
            duration_seconds=120,
        )
        self.client.force_authenticate(self.user)

    def test_event_ingest_records_lesson_view(self):
        url = reverse("analytics:events")
        payload = {
            "event_type": LearningEvent.TYPE_LESSON_VIEWED,
            "course_id": self.course.course_id,
            "lesson_id": self.lesson.lesson_id,
            "metadata": {"position": 30},
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(LearningEvent.objects.count(), 1)
        event = LearningEvent.objects.first()
        self.assertEqual(event.lesson, self.lesson)
        self.assertEqual(event.metadata["position"], 30)

        summary = generate_daily_summary()
        self.assertEqual(summary.lessons_viewed, 1)
        self.assertEqual(summary.active_students, 1)

    def test_admin_summary_endpoint(self):
        # Seed some activity
        StudentCourse.objects.create(
            student=self.student,
            course=self.course,
            completed=True,
            total_lessons=1,
            lessons_completed=1,
            progress_percent=100,
            last_seen=timezone.now(),
        )
        StudentLesson.objects.create(
            course=StudentCourse.objects.get(student=self.student, course=self.course),
            lesson=self.lesson,
            completed=True,
        )
        record_time = timezone.now() - timedelta(hours=1)
        LearningEvent.objects.create(
            user=self.user,
            student=self.student,
            course=self.course,
            lesson=self.lesson,
            event_type=LearningEvent.TYPE_LESSON_COMPLETED,
            occurred_at=record_time,
        )
        generate_daily_summary()

        admin_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            password="adminpass",
        )
        self.client.force_authenticate(admin_user)
        url = reverse("analytics:admin-summary")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data["data"]
        self.assertGreaterEqual(data["stats"]["totalStudents"], 1)
        self.assertGreaterEqual(len(data["recent_activity"]), 1)
        self.assertGreaterEqual(len(data["timeseries"]), 1)

        export_url = reverse("analytics:admin-summary-export")
        csv_response = self.client.get(export_url)
        self.assertEqual(csv_response.status_code, status.HTTP_200_OK)
        self.assertEqual(csv_response["Content-Type"], "text/csv")


class AnalyticsServiceTests(TestCase):
    def test_backfill_daily_summaries_validates_range(self):
        today = timezone.localdate()
        with self.assertRaises(ValueError):
            backfill_daily_summaries(today, today - timedelta(days=1))


class AnalyticsManagementCommandTests(TestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.user = User.objects.create_user(
            email="command-student@example.com",
            password="password123",
            first_name="Kwesi",
            last_name="Boateng",
        )
        self.school = School.objects.create(
            school_id="SCH-CMD",
            name="Command Test School",
            region="Ashanti",
            district="Kumasi",
            phone="0200000000",
            contact_person="Head Teacher",
            contact_email="command-school@example.com",
        )
        self.student = Student.objects.create(user=self.user, school=self.school)

    def test_backfill_command_generates_expected_summaries(self):
        yesterday = timezone.localdate() - timedelta(days=1)
        LearningEvent.objects.create(
            user=self.user,
            student=self.student,
            event_type=LearningEvent.TYPE_LESSON_VIEWED,
            occurred_at=timezone.now() - timedelta(days=1),
        )

        call_command("backfill_analytics", start=yesterday.isoformat(), end=yesterday.isoformat())

        summary = DailyEngagementSummary.objects.get(date=yesterday)
        self.assertEqual(summary.lessons_viewed, 1)
        self.assertEqual(summary.active_students, 1)

    def test_backfill_command_rejects_invalid_range(self):
        with self.assertRaises(CommandError):
            call_command("backfill_analytics", start="2025-09-10", end="2025-09-01")
