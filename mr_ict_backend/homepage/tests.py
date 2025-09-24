from __future__ import annotations

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from analytics.models import LearningEvent
from analytics.services import generate_daily_summary, record_event
from courses.models import Course, Lesson, Module, PublishStatus
from schools.models import School
from students.models import Student


class AdminDashboardViewTests(APITestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.admin = User.objects.create_user(
            email="admin@example.com",
            password="adminpass123",
            first_name="Admin",
            last_name="User",
            is_staff=True,
        )
        school = School.objects.create(
            school_id="SCH-TEST",
            name="Analytics School",
            region="Greater Accra",
            district="Accra",
            phone="123456789",
            contact_person="Coordinator",
            contact_email="school@example.com",
        )
        student_user = User.objects.create_user(
            email="student@example.com",
            password="pass12345",
            first_name="Learner",
            last_name="One",
        )
        student = Student.objects.create(user=student_user, school=school)
        course = Course.objects.create(title="HTML Basics", status=PublishStatus.PUBLISHED)
        module = Module.objects.create(course=course, title="Module 1", order=1, status=PublishStatus.PUBLISHED)
        lesson = Lesson.objects.create(
            course=course,
            module=module,
            title="Intro",
            order=1,
            status=PublishStatus.PUBLISHED,
        )
        record_event(
            event_type=LearningEvent.TYPE_LESSON_COMPLETED,
            user=student_user,
            student=student,
            course=course,
            lesson=lesson,
            metadata={},
        )
        generate_daily_summary()

    def test_admin_dashboard_returns_summary(self):
        self.client.force_authenticate(self.admin)
        url = reverse("homepage:get_admin_dashboard_data_view")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data["data"]
        self.assertIn("stats", payload)
        self.assertIn("recentActivity", payload)
