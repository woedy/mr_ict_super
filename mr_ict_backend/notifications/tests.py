from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from django.contrib.auth import get_user_model

from notifications.models import Announcement
from schools.models import School
from students.models import Student

User = get_user_model()


class AnnouncementApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='notify@example.com',
            password='password123',
            first_name='Yaa',
            last_name='Mensima',
        )
        self.school = School.objects.create(
            school_id='SCH-400',
            name='Notifications School',
            region='Eastern',
            district='Koforidua',
            phone='233100200',
        )
        self.student = Student.objects.create(user=self.user, school=self.school, active=True)
        Announcement.objects.create(
            title='Welcome Week',
            body='Join us for orientation and kickoff events!',
            audience=Announcement.AUDIENCE_ALL,
            active=True,
        )
        self.client.force_authenticate(self.user)

    def test_student_announcements_endpoint(self):
        url = reverse('notifications_api:student-announcements')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['title'], 'Welcome Week')
