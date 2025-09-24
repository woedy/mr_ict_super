from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from assessments.models import Assessment, Question, StudentQuizAttempt
from courses.models import Course, Lesson, Module, PublishStatus
from schools.models import School
from students.models import Student, StudentXPEvent
from django.contrib.auth import get_user_model

User = get_user_model()


class AssessmentApiTests(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='student@example.com',
            password='password123',
            first_name='Ama',
            last_name='Mensah',
        )
        self.school = School.objects.create(
            name='Test School',
            region='Greater Accra',
            district='Accra',
            phone='1234567890',
            active=True,
        )
        course = Course.objects.create(
            course_id='course-1',
            title='Intro to Python',
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        module = Module.objects.create(course=course, title='Module 1', order=1, status=PublishStatus.PUBLISHED)
        self.lesson = Lesson.objects.create(
            lesson_id='lesson-1',
            course=course,
            module=module,
            title='Lesson 1',
            order=1,
            status=PublishStatus.PUBLISHED,
            active=True,
        )
        Student.objects.filter(user=self.user).delete()
        self.student = Student.objects.create(user=self.user, school=self.school, active=True)
        self.assessment = Assessment.objects.create(
            lesson=self.lesson,
            title='Quick Quiz',
            passing_score=50,
            reward_xp=25,
            active=True,
            is_practice=False,
            max_attempts=2,
        )
        Question.objects.create(
            assessment=self.assessment,
            question_text='What is Python?',
            question_type=Question.MULTIPLE_CHOICE,
            options=['Snake', 'Programming language'],
            correct_answer='Programming language',
            order=1,
            points=5,
            active=True,
        )
        Question.objects.create(
            assessment=self.assessment,
            question_text='Python is strongly typed.',
            question_type=Question.TRUE_FALSE,
            correct_answer='True',
            order=2,
            points=5,
            active=True,
        )
        self.token = RefreshToken.for_user(self.user).access_token
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_assessment_list_includes_attempt_counts(self):
        list_url = reverse('assessments_api:student-assessment-list')
        response = self.client.get(list_url)
        self.assertEqual(response.status_code, 200)
        payload = response.data['data']
        self.assertEqual(len(payload), 1)
        assessment_payload = payload[0]
        self.assertEqual(assessment_payload['attempts_used'], 0)
        self.assertEqual(assessment_payload['attempts_remaining'], 2)

    def test_successful_attempt_awards_xp(self):
        attempt_url = reverse('assessments_api:student-assessment-attempt', kwargs={'slug': self.assessment.slug})
        response = self.client.post(
            attempt_url,
            {
                'answers': {
                    str(self.assessment.questions.first().id): 'Programming language',
                    str(self.assessment.questions.last().id): 'True',
                },
                'started_at': '2025-09-22T12:00:00Z',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        data = response.data['data']
        self.assertEqual(data['status'], StudentQuizAttempt.PASSED)
        self.assertEqual(data['awarded_xp'], 25)
        self.assertEqual(StudentXPEvent.objects.filter(student=self.student).count(), 1)
        self.student.refresh_from_db()
        self.assertEqual(self.student.epz, 25)
        self.assessment.refresh_from_db()
        self.assertEqual(StudentQuizAttempt.objects.filter(student=self.student, assessment=self.assessment).count(), 1)
