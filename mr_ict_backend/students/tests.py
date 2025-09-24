from __future__ import annotations

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import (
    ChallengeBadge,
    CodingChallenge,
    Course,
    Lesson,
    LessonAssignment,
    LessonCodeSnippet,
    LessonInsertOutput,
    LessonVideo,
    Module,
    PublishStatus,
)
from schools.models import School
from students.models import LessonComment, Student, StudentCertificate, StudentCourse, StudentLesson, StudentXPEvent
from students.services.progression import award_xp


class StudentExperienceAPITests(APITestCase):
    def setUp(self) -> None:
        User = get_user_model()
        self.user = User.objects.create_user(
            email="student@example.com",
            password="password123",
            first_name="Stu",
            last_name="Dent",
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
            title="Intro to HTML",
            summary="Learn the basics of HTML",
            description="A gentle introduction to building web pages.",
            level="Beginner",
            tags=["html", "web"],
            status=PublishStatus.PUBLISHED,
        )
        self.module = Module.objects.create(
            course=self.course,
            title="Getting started",
            order=1,
            status=PublishStatus.PUBLISHED,
        )
        self.lesson = Lesson.objects.create(
            course=self.course,
            module=self.module,
            title="What is HTML?",
            order=1,
            description="Overview of HTML",
            content="<p>HTML stands for HyperText Markup Language</p>",
            status=PublishStatus.PUBLISHED,
            duration_seconds=120,
        )
        self.video = LessonVideo.objects.create(
            lesson=self.lesson,
            video_url="https://cdn.example.com/html-intro.mp4",
            language="English",
            duration=120,
        )
        LessonInsertOutput.objects.create(
            lesson=self.lesson,
            subtitles_url=None,
            content="<code>&lt;h1&gt;Hello&lt;/h1&gt;</code>",
            duration=5,
            window_position={"x": 0, "y": 0},
            window_dimension={"width": 640, "height": 360},
            timestamp=30,
        )
        LessonCodeSnippet.objects.create(
            lesson=self.lesson,
            timestamp=45,
            code_content="print('Hello HTML')",
            cursor_position={"line": 1, "column": 5},
            scroll_position={"top": 0},
            is_highlight=False,
            output="Hello HTML",
        )
        LessonAssignment.objects.create(
            lesson=self.lesson,
            title="Create your first page",
            instructions="Build a basic HTML page.",
            expected_output="A page with a heading",
            code_template="<h1>Your title</h1>",
            difficulty="easy",
        )

        starter_code = (
            "def add_numbers():\n"
            "    raw = input().strip()\n"
            "    if not raw:\n"
            "        print(0)\n"
            "        return\n"
            "    first, second = [int(part) for part in raw.split()]\n"
            "    print(first + second)\n\n"
            "if __name__ == '__main__':\n"
            "    add_numbers()\n"
        )

        self.challenge = CodingChallenge.objects.create(
            course=self.course,
            title="Add Two Numbers",
            instructions="Read two integers separated by a space and print their sum.",
            difficulty="easy",
            starter_files=[
                {"name": "main.py", "language": "python", "content": starter_code},
            ],
            solution_files=[
                {"name": "main.py", "language": "python", "content": starter_code},
            ],
            hints=[
                "Use input().split() to grab both numbers in one line.",
                "Remember to convert the raw strings to integers before adding.",
            ],
            test_cases=[
                {"name": "sample", "stdin": "2 3\n", "expected_output": "5\n"},
                {"name": "larger", "stdin": "11 19\n", "expected_output": "30\n"},
            ],
        )

        self.challenge_slug = self.challenge.slug

        self.client.force_authenticate(self.user)

    def _enroll(self) -> StudentCourse:
        response = self.client.post(
            reverse("students:student_course_enroll", args=[self.course.course_id])
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return StudentCourse.objects.get(student=self.student, course=self.course)

    def test_profile_onboarding_flow(self):
        profile_url = reverse("students:student_profile")

        response = self.client.get(profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["data"]["has_completed_onboarding"])

        payload = {
            "preferred_language": "English",
            "accessibility_preferences": ["captions", "high-contrast"],
            "interest_tags": ["web", "design"],
            "allow_offline_downloads": True,
        }
        response = self.client.patch(profile_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data["data"]
        self.assertTrue(data["has_completed_onboarding"])
        self.assertEqual(sorted(data["accessibility_preferences"]), ["captions", "high-contrast"])
        self.student.refresh_from_db()
        self.assertTrue(self.student.has_completed_onboarding)
        self.assertEqual(self.student.preferred_language, "English")

    def test_catalog_enrollment_and_detail(self):
        catalog_url = reverse("students:student_course_catalog")
        response = self.client.get(catalog_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["results"][0]["is_enrolled"])

        student_course = self._enroll()
        self.assertEqual(student_course.total_lessons, 1)

        detail_url = reverse("students:student_course_detail", args=[self.course.course_id])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        detail_data = detail_response.data["data"]
        self.assertTrue(detail_data["is_enrolled"])
        self.assertEqual(len(detail_data["modules"]), 1)
        self.assertEqual(detail_data["modules"][0]["lessons"][0]["lesson_id"], self.lesson.lesson_id)

        catalog_response = self.client.get(catalog_url)
        self.assertTrue(catalog_response.data["results"][0]["is_enrolled"])

    def test_lesson_playback_and_progress(self):
        self._enroll()

        playback_url = reverse("students:student_lesson_playback", args=[self.lesson.lesson_id])
        response = self.client.get(playback_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data["data"]
        self.assertIn("primary_video", payload)
        self.assertGreater(len(payload["download_manifest"]), 0)

        progress_url = reverse("students:student_lesson_progress", args=[self.lesson.lesson_id])
        progress_payload = {"last_position_seconds": 30.5, "completed": True}
        progress_response = self.client.post(progress_url, progress_payload, format="json")
        self.assertEqual(progress_response.status_code, status.HTTP_200_OK)
        self.assertTrue(progress_response.data["data"]["completed"])

        student_lesson = StudentLesson.objects.get(course__student=self.student, lesson=self.lesson)
        self.assertTrue(student_lesson.completed)
        self.assertAlmostEqual(student_lesson.last_position_seconds, 30.5)

    def test_dashboard_payload_contains_sections(self):
        self._enroll()
        dashboard_url = reverse("students:student_dashboard")
        response = self.client.get(dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data["data"]
        self.assertIn("user", data)
        self.assertIn("overview", data)
        self.assertIn("resume_learning", data)
        self.assertIn("recommended_courses", data)
        self.assertIn("practice", data)

    def test_coding_challenge_interactive_flow(self):
        list_url = reverse("students:student_coding_challenge_list")
        list_response = self.client.get(list_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(list_response.data["results"]), 1)

        detail_url = reverse("students:student_coding_challenge_detail", args=[self.challenge_slug])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        detail_payload = detail_response.data["data"]
        self.assertEqual(detail_payload["slug"], self.challenge_slug)
        self.assertEqual(len(detail_payload["hints"]["revealed"]), 0)

        autosave_url = reverse("students:student_coding_challenge_autosave", args=[self.challenge_slug])
        incorrect_files = [
            {
                "name": "main.py",
                "language": "python",
                "content": detail_payload["starter_files"][0]["content"].replace("first + second", "first - second"),
            }
        ]
        autosave_response = self.client.post(autosave_url, {"files": incorrect_files}, format="json")
        self.assertEqual(autosave_response.status_code, status.HTTP_200_OK)

        run_url = reverse("students:student_coding_challenge_run", args=[self.challenge_slug])
        run_response = self.client.post(run_url, {"stdin": "4 2\n"}, format="json")
        self.assertEqual(run_response.status_code, status.HTTP_200_OK)
        run_payload = run_response.data["data"]
        self.assertIn("stdout", run_payload)

        submit_url = reverse("students:student_coding_challenge_submit", args=[self.challenge_slug])
        submit_response = self.client.post(submit_url, {}, format="json")
        self.assertEqual(submit_response.status_code, status.HTTP_200_OK)
        self.assertFalse(submit_response.data["data"]["passed"])

        hint_url = reverse("students:student_coding_challenge_hint", args=[self.challenge_slug])
        hint_response = self.client.post(hint_url, {}, format="json")
        self.assertEqual(hint_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(hint_response.data["data"]["revealed"]), 1)

        reset_url = reverse("students:student_coding_challenge_reset", args=[self.challenge_slug])
        reset_response = self.client.post(reset_url, {}, format="json")
        self.assertEqual(reset_response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            reset_response.data["data"]["files"][0]["content"],
            detail_payload["starter_files"][0]["content"],
        )

        correct_files = detail_payload["starter_files"]
        submit_response = self.client.post(submit_url, {"files": correct_files}, format="json")
        self.assertTrue(submit_response.data["data"]["passed"])
        self.assertIn("solution_files", submit_response.data["data"])

    def test_coding_challenge_rejects_unsafe_files(self):
        autosave_url = reverse("students:student_coding_challenge_autosave", args=[self.challenge_slug])
        payload = {
            "files": [
                {"name": "../escape.py", "content": "print('oops')"},
            ]
        }
        response = self.client.post(autosave_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

        run_url = reverse("students:student_coding_challenge_run", args=[self.challenge_slug])
        self.challenge.entrypoint_filename = "../../bad.py"
        self.challenge.save(update_fields=["entrypoint_filename"])
        run_response = self.client.post(run_url, {}, format="json")
        self.assertEqual(run_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", run_response.data)

    def test_student_project_workspace_validation(self):
        create_url = reverse("students:student_projects")
        schema = {
            "required_files": ["index.html", "styles.css", "scripts.js"],
            "rules": [
                {"file": "index.html", "contains": ["<button", "scripts.js"]},
                {"file": "scripts.js", "contains": ["console.log"]},
            ],
        }
        create_payload = {"title": "My Project", "validation_schema": schema}
        create_response = self.client.post(create_url, create_payload, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        project_id = create_response.data["data"]["project_id"]

        list_response = self.client.get(create_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data["results"]), 1)

        detail_url = reverse("students:student_project_detail", args=[project_id])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["data"]["title"], "My Project")

        files = detail_response.data["data"]["files"]
        files[0]["content"] = files[0]["content"].replace("<button id=\"action-btn\">Click me</button>", "<div>No button</div>")

        validate_url = reverse("students:student_project_validate", args=[project_id])
        validate_response = self.client.post(validate_url, {"files": files}, format="json")
        self.assertEqual(validate_response.status_code, status.HTTP_200_OK)
        self.assertFalse(validate_response.data["data"]["passed"])

        files[0]["content"] = files[0]["content"].replace("<div>No button</div>", "<button id=\"action-btn\">Click again</button>")
        validate_response = self.client.post(validate_url, {"files": files}, format="json")
        self.assertTrue(validate_response.data["data"]["passed"])

        publish_url = reverse("students:student_project_publish", args=[project_id])
        publish_response = self.client.post(publish_url, {"publish": True}, format="json")
        self.assertEqual(publish_response.status_code, status.HTTP_200_OK)
        self.assertTrue(publish_response.data["data"]["is_published"])


class StudentProgressSummaryTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='progress@example.com',
            password='password123',
            first_name='Kofi',
            last_name='Boateng',
        )
        self.school = School.objects.create(
            school_id='SCH-200',
            name='Progress School',
            region='Greater Accra',
            district='Accra',
            phone='2331234567',
        )
        self.student = Student.objects.create(user=self.user, school=self.school, active=True)
        self.course = Course.objects.create(
            course_id='course-progress',
            title='Progress Course',
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        self.module = Module.objects.create(course=self.course, title='Module', order=1, status=PublishStatus.PUBLISHED)
        self.lesson = Lesson.objects.create(
            course=self.course,
            module=self.module,
            title='Progress Lesson',
            order=1,
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        award_xp(student=self.student, amount=40, source=StudentXPEvent.SOURCE_MANUAL, description='Bonus XP')
        StudentCertificate.objects.create(
            student=self.student,
            course=self.course,
            title='Participation Certificate',
            description='Awarded for completing onboarding',
            issued_by='Mr ICT',
        )
        self.client.force_authenticate(self.user)

    def test_progress_summary_returns_totals(self):
        url = reverse('students_api:student_progress_summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        self.assertEqual(data['xp']['total'], 40)
        self.assertEqual(len(data['xp']['events']), 1)
        self.assertEqual(len(data['certificates']), 1)


class LessonCommentApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='commenter@example.com',
            password='password123',
            first_name='Comment',
            last_name='Tester',
        )
        self.school = School.objects.create(
            school_id='SCH-300',
            name='Discussion School',
            region='Ashanti',
            district='Kumasi',
            phone='233987654',
        )
        self.student = Student.objects.create(user=self.user, school=self.school, active=True)
        self.course = Course.objects.create(
            course_id='course-comments',
            title='Comments Course',
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        self.module = Module.objects.create(course=self.course, title='Module', order=1, status=PublishStatus.PUBLISHED)
        self.lesson = Lesson.objects.create(
            course=self.course,
            module=self.module,
            title='Discussion Lesson',
            order=1,
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        self.client.force_authenticate(self.user)

    def test_create_and_like_comment(self):
        create_url = reverse('students_api:student_lesson_comments', kwargs={'lesson_id': self.lesson.lesson_id})
        response = self.client.post(create_url, {'body': 'This lesson is great!'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        comment_id = response.data['data']['id']

        list_response = self.client.get(create_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data['data']), 1)

        like_url = reverse('students_api:student_lesson_comment_like', kwargs={'comment_id': comment_id})
        like_response = self.client.post(like_url)
        self.assertEqual(like_response.status_code, status.HTTP_200_OK)
        self.assertTrue(like_response.data['data']['liked'])
