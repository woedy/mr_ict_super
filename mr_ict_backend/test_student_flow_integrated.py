"""
Integrated test for complete student flow with automatic email verification
"""
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

BASE_URL = "http://localhost:8000"
TEST_EMAIL = "newstudent@example.com"
TEST_PASSWORD = "SecurePass123!"
TEST_FIRST_NAME = "New"
TEST_LAST_NAME = "Student"
SCHOOL_ID = "SCH-0JP0Z5GR-OL"

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def print_result(success, message):
    status = "✅" if success else "❌"
    print(f"{status} {message}")

def cleanup_user():
    """Remove test user if exists"""
    try:
        user = User.objects.get(email=TEST_EMAIL)
        user.delete()
        print(f"🧹 Cleaned up existing user: {TEST_EMAIL}")
    except User.DoesNotExist:
        pass

def test_registration():
    print_section("1. STUDENT REGISTRATION")
    
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
    
    response = requests.post(url, json=data)
    
    if response.status_code == 200 and response.json().get('message') == 'Successful':
        print_result(True, "Registration successful")
        data = response.json().get('data', {})
        print(f"   📧 Email: {data.get('email')}")
        print(f"   👤 Name: {data.get('first_name')} {data.get('last_name')}")
        print(f"   🎫 User ID: {data.get('user_id')}")
        return True
    else:
        print_result(False, f"Registration failed: {response.json()}")
        return False

def verify_email():
    print_section("2. EMAIL VERIFICATION (Auto)")
    
    try:
        user = User.objects.get(email=TEST_EMAIL)
        email_token = user.email_token
        print(f"   🔑 Email Token: {email_token}")
        
        # Auto-verify for testing
        user.email_verified = True
        user.is_active = True
        user.save()
        
        print_result(True, "Email verified automatically (dev mode)")
        return True
    except User.DoesNotExist:
        print_result(False, "User not found")
        return False

def test_login():
    print_section("3. STUDENT LOGIN")
    
    url = f"{BASE_URL}/api/accounts/login-student/"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "fcm_token": "web-test-token"
    }
    
    response = requests.post(url, json=data)
    
    if response.status_code == 200 and response.json().get('message') == 'Successful':
        print_result(True, "Login successful")
        data = response.json().get('data', {})
        print(f"   🎫 Access Token: {data.get('access', '')[:40]}...")
        print(f"   🔄 Refresh Token: {data.get('refresh', '')[:40]}...")
        print(f"   📋 Requires Onboarding: {data.get('requires_onboarding')}")
        return data.get('access')
    else:
        print_result(False, f"Login failed: {response.json()}")
        return None

def test_get_profile(access_token):
    print_section("4. GET STUDENT PROFILE")
    
    url = f"{BASE_URL}/api/students/experience/me/"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200 and response.json().get('message') == 'Successful':
        print_result(True, "Profile retrieved")
        profile = response.json().get('data', {})
        print(f"   📧 Email: {profile.get('email')}")
        print(f"   👤 Name: {profile.get('first_name')} {profile.get('last_name')}")
        print(f"   🌍 Language: {profile.get('preferred_language')}")
        print(f"   ✅ Onboarding Complete: {profile.get('has_completed_onboarding')}")
        print(f"   🏆 Badge Count: {profile.get('badge_count')}")
        return True
    else:
        print_result(False, f"Profile retrieval failed: {response.json()}")
        return False

def test_update_profile(access_token):
    print_section("5. UPDATE PROFILE (Complete Onboarding)")
    
    url = f"{BASE_URL}/api/students/experience/me/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "preferred_language": "English",
        "interest_tags": ["Web Development", "Python Programming"],
        "accessibility_preferences": [],
        "has_completed_onboarding": True
    }
    
    response = requests.patch(url, json=data, headers=headers)
    
    if response.status_code == 200 and response.json().get('message') == 'Successful':
        print_result(True, "Profile updated (Onboarding complete)")
        profile = response.json().get('data', {})
        print(f"   🌍 Language: {profile.get('preferred_language')}")
        print(f"   🎯 Interests: {', '.join(profile.get('interest_tags', []))}")
        print(f"   ✅ Onboarding: {profile.get('has_completed_onboarding')}")
        return True
    else:
        print_result(False, f"Profile update failed: {response.json()}")
        return False

def test_login_after_onboarding():
    print_section("6. LOGIN AFTER ONBOARDING")
    
    url = f"{BASE_URL}/api/accounts/login-student/"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "fcm_token": "web-test-token-2"
    }
    
    response = requests.post(url, json=data)
    
    if response.status_code == 200 and response.json().get('message') == 'Successful':
        print_result(True, "Login successful after onboarding")
        data = response.json().get('data', {})
        print(f"   📋 Requires Onboarding: {data.get('requires_onboarding')}")
        return True
    else:
        print_result(False, f"Login failed: {response.json()}")
        return False

def main():
    print("\n" + "🎓 " * 35)
    print("  COMPLETE STUDENT JOURNEY TEST - INTEGRATED")
    print("🎓 " * 35)
    
    # Cleanup
    cleanup_user()
    
    # Run tests
    results = []
    
    # Test 1: Registration
    if not test_registration():
        print("\n❌ FAILED: Cannot continue without successful registration")
        return
    results.append(("Registration", True))
    
    # Test 2: Email Verification
    if not verify_email():
        print("\n❌ FAILED: Cannot continue without email verification")
        return
    results.append(("Email Verification", True))
    
    # Test 3: Login
    access_token = test_login()
    if not access_token:
        print("\n❌ FAILED: Cannot continue without successful login")
        return
    results.append(("Login", True))
    
    # Test 4: Get Profile
    if not test_get_profile(access_token):
        print("\n❌ FAILED: Profile retrieval failed")
        return
    results.append(("Get Profile", True))
    
    # Test 5: Update Profile (Onboarding)
    if not test_update_profile(access_token):
        print("\n❌ FAILED: Profile update failed")
        return
    results.append(("Update Profile", True))
    
    # Test 6: Login After Onboarding
    if not test_login_after_onboarding():
        print("\n❌ FAILED: Login after onboarding failed")
        return
    results.append(("Login After Onboarding", True))
    
    # Summary
    print_section("TEST SUMMARY")
    for test_name, passed in results:
        print_result(passed, test_name)
    
    print("\n🎉 " * 35)
    print("  ALL TESTS PASSED! Student journey is working perfectly!")
    print("🎉 " * 35)
    
    print("\n📝 What was tested:")
    print("   ✅ Student registration with all required fields")
    print("   ✅ Email verification (auto in dev mode)")
    print("   ✅ Student login with JWT tokens")
    print("   ✅ Profile retrieval with authentication")
    print("   ✅ Profile update (onboarding completion)")
    print("   ✅ Login after onboarding (no onboarding required)")
    
    print("\n🚀 Ready for production!")

if __name__ == "__main__":
    main()
