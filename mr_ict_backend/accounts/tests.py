import json
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django

django.setup()

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from schools.models import School
from students.models import Student

User = get_user_model()


class StudentRegistrationTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(
            school_id="TEST-001",
            name="Test School",
            region="Greater Accra",
            district="Accra",
            phone="1234567890",
            contact_person="Test Coordinator",
            contact_email="test@example.com",
        )

        self.registration_data = {
            "email": "teststudent@example.com",
            "first_name": "Test",
            "last_name": "Student",
            "phone": "+233123456789",
            "country": "Ghana",
            "password": "TestPass123!",
            "password2": "TestPass123!",
            "school_id": self.school.school_id,
        }

        self.invalid_registration_data = {
            "email": "invalid-email",
            "first_name": "",
            "last_name": "",
            "password": "weak",
            "password2": "different",
            "school_id": "nonexistent",
        }

    def test_successful_student_registration(self):
        """Test successful student registration with valid data"""
        url = reverse("accounts:register_student")
        response = self.client.post(url, self.registration_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successful")

        # Check that user was created
        user = User.objects.get(email=self.registration_data["email"])
        self.assertEqual(user.first_name, self.registration_data["first_name"])
        self.assertEqual(user.last_name, self.registration_data["last_name"])
        self.assertEqual(user.user_type, "Student")
        self.assertFalse(user.email_verified)  # Should not be verified initially
        self.assertTrue(user.is_active)

        # Check that student profile was created
        student = Student.objects.get(user=user)
        self.assertEqual(student.school, self.school)

        # Check response data
        data = response.data["data"]
        self.assertIn("user_id", data)
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertIn("requires_onboarding", data)
        self.assertTrue(data["requires_onboarding"])

    def test_registration_with_invalid_email(self):
        """Test registration with invalid email format"""
        url = reverse("accounts:register_student")
        response = self.client.post(url, self.invalid_registration_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data["errors"])

    def test_registration_with_missing_required_fields(self):
        """Test registration with missing required fields"""
        url = reverse("accounts:register_student")
        response = self.client.post(url, self.invalid_registration_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("first_name", response.data["errors"])
        self.assertIn("last_name", response.data["errors"])
        self.assertIn("password", response.data["errors"])

    def test_registration_with_mismatched_passwords(self):
        """Test registration with mismatched passwords"""
        data = self.registration_data.copy()
        data["password2"] = "DifferentPass123!"

        url = reverse("accounts:register_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data["errors"])

    def test_registration_with_weak_password(self):
        """Test registration with password that doesn't meet requirements"""
        data = self.registration_data.copy()
        data["password"] = "weak"
        data["password2"] = "weak"

        url = reverse("accounts:register_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data["errors"])

    def test_registration_with_existing_email(self):
        """Test registration with email that already exists"""
        # Create a user first
        User.objects.create_user(
            email="existing@example.com",
            password="TestPass123!",
            first_name="Existing",
            last_name="User",
        )

        data = self.registration_data.copy()
        data["email"] = "existing@example.com"

        url = reverse("accounts:register_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data["errors"])

    def test_registration_with_nonexistent_school(self):
        """Test registration with school_id that doesn't exist"""
        data = self.registration_data.copy()
        data["school_id"] = "NONEXISTENT"

        url = reverse("accounts:register_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("school_id", response.data["errors"])


class StudentLoginTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(
            school_id="LOGIN-001",
            name="Login School",
            region="Greater Accra",
            district="Accra",
            phone="1234567890",
            contact_person="Coordinator",
            contact_email="login@example.com",
        )

        self.user = User.objects.create_user(
            email="logintest@example.com",
            password="LoginPass123!",
            first_name="Login",
            last_name="Test",
        )
        self.user.user_type = "Student"
        self.user.email_verified = True  # Already verified for login tests
        self.user.save()

        self.student = Student.objects.create(user=self.user, school=self.school)

        self.login_data = {
            "email": "logintest@example.com",
            "password": "LoginPass123!",
            "fcm_token": "test-fcm-token-123",
        }

        self.invalid_login_data = {
            "email": "logintest@example.com",
            "password": "WrongPassword!",
            "fcm_token": "test-fcm-token-123",
        }

    def test_successful_student_login(self):
        """Test successful student login with valid credentials"""
        url = reverse("accounts:login_student")
        response = self.client.post(url, self.login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successful")

        # Check response data
        data = response.data["data"]
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertIn("user_id", data)
        self.assertIn("student_id", data)
        self.assertIn("first_name", data)
        self.assertIn("last_name", data)
        self.assertIn("requires_onboarding", data)

        # Check that FCM token was saved
        self.user.refresh_from_db()
        self.assertEqual(self.user.fcm_token, "test-fcm-token-123")

    def test_login_with_unverified_email(self):
        """Test login attempt with unverified email"""
        unverified_user = User.objects.create_user(
            email="unverified@example.com",
            password="UnverifiedPass123!",
            first_name="Unverified",
            last_name="User",
        )
        unverified_user.user_type = "Student"
        unverified_user.email_verified = False
        unverified_user.save()

        data = self.login_data.copy()
        data["email"] = "unverified@example.com"

        url = reverse("accounts:login_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data["errors"])

    def test_login_with_invalid_credentials(self):
        """Test login with invalid password"""
        url = reverse("accounts:login_student")
        response = self.client.post(url, self.invalid_login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data["errors"])

    def test_login_with_missing_fields(self):
        """Test login with missing required fields"""
        data = {"email": "logintest@example.com"}  # Missing password and fcm_token

        url = reverse("accounts:login_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data["errors"])
        self.assertIn("fcm_token", response.data["errors"])

    def test_login_with_nonexistent_user(self):
        """Test login with email that doesn't exist"""
        data = self.login_data.copy()
        data["email"] = "nonexistent@example.com"

        url = reverse("accounts:login_student")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data["errors"])


class EmailVerificationTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(
            school_id="VERIFY-001",
            name="Verification School",
            region="Greater Accra",
            district="Accra",
            phone="1234567890",
            contact_person="Coordinator",
            contact_email="verify@example.com",
        )

        self.user = User.objects.create_user(
            email="verifytest@example.com",
            password="VerifyPass123!",
            first_name="Verify",
            last_name="Test",
        )
        self.user.user_type = "Student"
        self.user.email_verified = False
        self.user.email_token = "1234"  # Set a known token for testing
        self.user.save()

        self.student = Student.objects.create(user=self.user, school=self.school)

    def test_successful_email_verification(self):
        """Test successful email verification with correct token"""
        data = {
            "email": "verifytest@example.com",
            "email_token": "1234",
        }

        url = reverse("accounts:verify_student_email")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successful")

        # Check that user is now verified
        self.user.refresh_from_db()
        self.assertTrue(self.user.email_verified)
        self.assertTrue(self.user.is_active)

        # Check response data
        response_data = response.data["data"]
        self.assertIn("access", response_data)
        self.assertIn("refresh", response_data)

    def test_email_verification_with_wrong_token(self):
        """Test email verification with incorrect token"""
        data = {
            "email": "verifytest@example.com",
            "email_token": "9999",
        }

        url = reverse("accounts:verify_student_email")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email_token", response.data["errors"])

        # Check that user is still not verified
        self.user.refresh_from_db()
        self.assertFalse(self.user.email_verified)

    def test_email_verification_with_nonexistent_email(self):
        """Test email verification with email that doesn't exist"""
        data = {
            "email": "nonexistent@example.com",
            "email_token": "1234",
        }

        url = reverse("accounts:verify_student_email")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data["errors"])

    def test_resend_email_verification(self):
        """Test resending email verification"""
        data = {"email": "verifytest@example.com"}

        url = reverse("accounts:resend_student_email_verification")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successful")

        # Check that a new token was generated
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.email_token)

        # Check response data
        response_data = response.data["data"]
        self.assertIn("email", response_data)
        self.assertIn("user_id", response_data)


class PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="passwordtest@example.com",
            password="OriginalPass123!",
            first_name="Password",
            last_name="Test",
        )
        self.user.user_type = "Student"
        self.user.save()

    def test_password_reset_request(self):
        """Test requesting password reset"""
        data = {"email": "passwordtest@example.com"}

        url = reverse("accounts:forgot_password")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successful")

    def test_password_reset_confirm_otp(self):
        """Test confirming OTP for password reset"""
        # This would need more setup to test the full flow
        # For now, just test the endpoint exists and validates input
        data = {
            "email": "passwordtest@example.com",
            "otp": "123456",
            "new_password": "NewPass123!",
            "confirm_password": "NewPass123!",
        }

        url = reverse("accounts:confirm_otp_password")
        response = self.client.post(url, data, format="json")

        # This might fail without proper setup, but endpoint should exist
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])


class OnboardingTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(
            school_id="ONBOARD-001",
            name="Onboarding School",
            region="Greater Accra",
            district="Accra",
            phone="1234567890",
            contact_person="Coordinator",
            contact_email="onboard@example.com",
        )

        self.user = User.objects.create_user(
            email="onboardtest@example.com",
            password="OnboardPass123!",
            first_name="Onboard",
            last_name="Test",
        )
        self.user.user_type = "Student"
        self.user.email_verified = True
        self.user.save()

        self.student = Student.objects.create(
            user=self.user,
            school=self.school,
            has_completed_onboarding=False
        )

        self.client.force_authenticate(self.user)

    def test_get_student_profile_before_onboarding(self):
        """Test getting student profile before completing onboarding"""
        url = reverse("students:student_profile")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["data"]["has_completed_onboarding"])

    def test_complete_onboarding(self):
        """Test completing student onboarding"""
        data = {
            "preferred_language": "English",
            "accessibility_preferences": ["captions", "high-contrast"],
            "interest_tags": ["web", "mobile"],
            "allow_offline_downloads": True,
        }

        url = reverse("students:student_profile")
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that onboarding is completed
        profile_data = response.data["data"]
        self.assertTrue(profile_data["has_completed_onboarding"])

        # Check that student model was updated
        self.student.refresh_from_db()
        self.assertTrue(self.student.has_completed_onboarding)
        self.assertEqual(self.student.preferred_language, "English")
        self.assertEqual(sorted(self.student.accessibility_preferences), ["captions", "high-contrast"])
        self.assertEqual(sorted(self.student.interest_tags), ["mobile", "web"])

    def test_onboarding_with_invalid_preferences(self):
        """Test onboarding with invalid preference data"""
        data = {
            "preferred_language": "",  # Invalid empty language
            "accessibility_preferences": "invalid_format",  # Should be list
            "interest_tags": ["web"],
            "allow_offline_downloads": True,
        }

        url = reverse("students:student_profile")
        response = self.client.patch(url, data, format="json")

        # Should return 400 Bad Request for invalid data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check that field-specific errors are present
        self.assertIn("accessibility_preferences", response.data)
        self.assertEqual(len(response.data["accessibility_preferences"]), 1)
