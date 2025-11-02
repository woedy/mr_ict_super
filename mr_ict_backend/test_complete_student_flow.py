"""
Comprehensive test for complete student registration, authentication, and onboarding flow
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Test data
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "TestPass123!"  # Meets all requirements
TEST_FIRST_NAME = "Test"
TEST_LAST_NAME = "User"
SCHOOL_ID = "SCH-0JP0Z5GR-OL"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def print_result(success, message):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def test_registration():
    print_section("TEST 1: Student Registration")
    
    url = f"{BASE_URL}/api/accounts/register-student/"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "password2": TEST_PASSWORD,
        "first_name": TEST_FIRST_NAME,
        "last_name": TEST_LAST_NAME,
        "phone": "",
        "country": "Ghana",
        "school_id": SCHOOL_ID
    }
    
    print(f"POST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                print_result(True, "Registration successful")
                return result.get('data', {})
            else:
                print_result(False, f"Registration failed: {result}")
                return None
        else:
            print_result(False, f"Registration failed with status {response.status_code}")
            print(f"Errors: {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Exception during registration: {str(e)}")
        return None

def test_email_verification(email_token):
    print_section("TEST 2: Email Verification")
    
    url = f"{BASE_URL}/api/accounts/verify-student-email/"
    data = {
        "email": TEST_EMAIL,
        "email_token": email_token
    }
    
    print(f"POST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                print_result(True, "Email verification successful")
                return result.get('data', {})
            else:
                print_result(False, f"Verification failed: {result}")
                return None
        else:
            print_result(False, f"Verification failed with status {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Exception during verification: {str(e)}")
        return None

def test_login():
    print_section("TEST 3: Student Login")
    
    url = f"{BASE_URL}/api/accounts/login-student/"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "fcm_token": "test-web-token"
    }
    
    print(f"POST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                print_result(True, "Login successful")
                data = result.get('data', {})
                print(f"\n📝 Access Token: {data.get('access', 'N/A')[:50]}...")
                print(f"📝 Refresh Token: {data.get('refresh', 'N/A')[:50]}...")
                print(f"📝 Requires Onboarding: {data.get('requires_onboarding', 'N/A')}")
                return data
            else:
                print_result(False, f"Login failed: {result}")
                return None
        else:
            print_result(False, f"Login failed with status {response.status_code}")
            print(f"Errors: {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Exception during login: {str(e)}")
        return None

def test_get_profile(access_token):
    print_section("TEST 4: Get Student Profile")
    
    url = f"{BASE_URL}/api/students/experience/me/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    print(f"GET {url}")
    print(f"Headers: Authorization: Bearer {access_token[:30]}...")
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                print_result(True, "Profile retrieved successfully")
                profile = result.get('data', {})
                print(f"\n📝 Email: {profile.get('email')}")
                print(f"📝 Name: {profile.get('first_name')} {profile.get('last_name')}")
                print(f"📝 Has Completed Onboarding: {profile.get('has_completed_onboarding')}")
                return profile
            else:
                print_result(False, f"Profile retrieval failed: {result}")
                return None
        else:
            print_result(False, f"Profile retrieval failed with status {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Exception during profile retrieval: {str(e)}")
        return None

def test_update_profile(access_token):
    print_section("TEST 5: Update Student Profile (Onboarding)")
    
    url = f"{BASE_URL}/api/students/experience/me/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "preferred_language": "English",
        "interest_tags": ["Web Development", "Data Science"],
        "accessibility_preferences": [],
        "has_completed_onboarding": True
    }
    
    print(f"PATCH {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.patch(url, json=data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                print_result(True, "Profile updated successfully (Onboarding complete)")
                return result.get('data', {})
            else:
                print_result(False, f"Profile update failed: {result}")
                return None
        else:
            print_result(False, f"Profile update failed with status {response.status_code}")
            return None
    except Exception as e:
        print_result(False, f"Exception during profile update: {str(e)}")
        return None

def cleanup():
    """Clean up test user"""
    print_section("CLEANUP: Removing Test User")
    
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(email=TEST_EMAIL)
        user.delete()
        print_result(True, f"Deleted test user: {TEST_EMAIL}")
    except User.DoesNotExist:
        print_result(True, "No test user to clean up")

def main():
    print("\n" + "🚀 " * 30)
    print("  COMPLETE STUDENT FLOW TEST")
    print("🚀 " * 30)
    
    # Cleanup any existing test user first
    cleanup()
    
    # Test 1: Registration
    registration_data = test_registration()
    if not registration_data:
        print("\n❌ Registration failed. Cannot continue tests.")
        return
    
    # Note: In production, you'd need to get the email_token from email
    # For testing, we'll skip email verification or manually get the token
    print("\n⚠️  NOTE: Email verification requires checking email for OTP code")
    print("    For automated testing, you would need to:")
    print("    1. Use a test email service")
    print("    2. Or query the database for the email_token")
    print("    3. Or disable email verification in development")
    
    # Test 3: Login (assuming email is verified or verification is disabled)
    login_data = test_login()
    if not login_data:
        print("\n❌ Login failed. This might be due to unverified email.")
        print("   Check if email_verified is required in StudentLogin view")
        return
    
    access_token = login_data.get('access')
    if not access_token:
        print("\n❌ No access token received")
        return
    
    # Test 4: Get Profile
    profile = test_get_profile(access_token)
    if not profile:
        print("\n❌ Profile retrieval failed")
        return
    
    # Test 5: Update Profile (Complete Onboarding)
    updated_profile = test_update_profile(access_token)
    if not updated_profile:
        print("\n❌ Profile update failed")
        return
    
    # Final Summary
    print_section("TEST SUMMARY")
    print("✅ Registration: PASSED")
    print("⚠️  Email Verification: SKIPPED (requires manual OTP)")
    print("✅ Login: PASSED")
    print("✅ Get Profile: PASSED")
    print("✅ Update Profile: PASSED")
    print("\n🎉 All automated tests passed!")
    print("\n📝 Manual steps required:")
    print("   1. Check email for verification code")
    print("   2. Verify email using the code")
    print("   3. Then login should work fully")

if __name__ == "__main__":
    main()
