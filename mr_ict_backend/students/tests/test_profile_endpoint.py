"""
Unit tests for Student Profile endpoints
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from schools.models import School
from students.models import Student

User = get_user_model()


class StudentProfileEndpointTest(TestCase):
    """Test suite for Student Profile endpoints"""

    def setUp(self):
        """Set up test data"""
        # Create school
        self.school = School.objects.create(
            school_id="TEST-SCHOOL",
            name="Test School",
            region="Test Region",
            district="Test District",
            phone="1234567890",
        )

        # Create user (custom User model uses email as USERNAME_FIELD)
        self.user = User.objects.create_user(
            email="teststudent@example.com",
            first_name="Test",
            last_name="Student",
            password="testpass123",
        )

        # Create student profile
        self.student = Student.objects.create(
            user=self.user,
            school=self.school,
            epz=100,
            preferred_language="English",
        )

        # Set up API client
        self.client = APIClient()

        # Get JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_get_profile_unauthenticated(self):
        """Test GET /api/students/experience/me/ without authentication"""
        response = self.client.get('/api/students/experience/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile_authenticated(self):
        """Test GET /api/students/experience/me/ with authentication"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/students/experience/me/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        
        data = response.data['data']
        self.assertEqual(data['email'], 'teststudent@example.com')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'Student')
        self.assertEqual(data['preferred_language'], 'English')
        self.assertIn('badge_count', data)  # New field from enhancement

    def test_patch_profile_authenticated(self):
        """Test PATCH /api/students/experience/me/ with authentication"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        update_data = {
            'preferred_language': 'French',
            'interest_tags': ['Python', 'Web Development'],
            'accessibility_preferences': ['Live captions'],
        }
        
        response = self.client.patch(
            '/api/students/experience/me/',
            update_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify updates
        self.student.refresh_from_db()
        self.assertEqual(self.student.preferred_language, 'French')
        self.assertIn('Python', self.student.interest_tags)
        self.assertIn('Live captions', self.student.accessibility_preferences)

    def test_patch_profile_unauthenticated(self):
        """Test PATCH /api/students/experience/me/ without authentication"""
        update_data = {'preferred_language': 'French'}
        response = self.client.patch(
            '/api/students/experience/me/',
            update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_has_badge_count(self):
        """Test that profile response includes badge_count field"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/api/students/experience/me/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        self.assertIn('badge_count', data)
        self.assertEqual(data['badge_count'], 0)  # No badges yet

    def test_onboarding_completion(self):
        """Test completing onboarding via PATCH"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        self.assertFalse(self.student.has_completed_onboarding)
        
        update_data = {
            'preferred_language': 'English',
            'interest_tags': ['Coding'],
            'complete_onboarding': True,
        }
        
        response = self.client.patch(
            '/api/students/experience/me/',
            update_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify onboarding completed
        self.student.refresh_from_db()
        self.assertTrue(self.student.has_completed_onboarding)
        self.assertIsNotNone(self.student.onboarding_completed_at)
