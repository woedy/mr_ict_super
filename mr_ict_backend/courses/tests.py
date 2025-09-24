from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from courses.models import Course, Lesson, LessonVideo, Module, PublishStatus


class AdminContentPipelineTests(APITestCase):
    def setUp(self) -> None:
        self.admin_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            password="password123",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin_user)

    def test_course_creation_defaults_to_draft(self):
        response = self.client.post(
            reverse("courses_admin_api:course-list"),
            {
                "title": "Intro to Web Dev",
                "summary": "Learn web foundations",
                "description": "A hands-on introduction to HTML, CSS, and JS.",
                "tags": ["web", "frontend"],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], PublishStatus.DRAFT)
        course = Course.objects.get(pk=response.data["id"])
        self.assertEqual(course.created_by, self.admin_user)

    def test_lesson_publish_requires_media(self):
        course = Course.objects.create(title="Course", summary="", description="desc")
        module = Module.objects.create(course=course, title="Module 1", order=1)
        lesson = Lesson.objects.create(module=module, title="Lesson 1", order=1, description="")

        publish_url = reverse("courses_admin_api:lesson-publish", args=[lesson.pk])
        response = self.client.post(publish_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("media", response.data)

        lesson.description = "Publishing walkthrough"
        lesson.content = "print('hello world')"
        lesson.save()
        response = self.client.post(publish_url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        lesson.refresh_from_db()
        self.assertEqual(lesson.status, PublishStatus.PUBLISHED)

    def test_module_and_course_publish_flow(self):
        course = Course.objects.create(
            title="Pipeline Course",
            summary="",
            description="Full pipeline",
            created_by=self.admin_user,
        )
        module = Module.objects.create(course=course, title="Module", order=1)
        lesson = Lesson.objects.create(
            module=module,
            order=1,
            title="Lesson",
            description="Lesson overview",
            content="Lesson body",
        )
        LessonVideo.objects.create(
            lesson=lesson,
            video_file=SimpleUploadedFile("video.mp4", b"fake data"),
        )

        lesson_publish_url = reverse("courses_admin_api:lesson-publish", args=[lesson.pk])
        response = self.client.post(lesson_publish_url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        module_publish_url = reverse("courses_admin_api:module-publish", args=[module.pk])
        response = self.client.post(module_publish_url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        module.refresh_from_db()
        self.assertEqual(module.status, PublishStatus.PUBLISHED)

        course_publish_url = reverse("courses_admin_api:course-publish", args=[course.pk])
        response = self.client.post(course_publish_url, {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        course.refresh_from_db()
        self.assertEqual(course.status, PublishStatus.PUBLISHED)

        audit_url = reverse("courses_admin_api:course-audit-log", args=[course.pk])
        audit_response = self.client.get(audit_url)
        self.assertEqual(audit_response.status_code, status.HTTP_200_OK)
        transitions = [entry["to_status"] for entry in audit_response.data]
        self.assertIn(PublishStatus.PUBLISHED, transitions)
