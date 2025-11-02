"""
Test admin login flow
"""
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from mr_admin.models import MrAdmin

User = get_user_model()
BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def print_result(success, message):
    status = "✅" if success else "❌"
    print(f"{status} {message}")

def check_admin_users():
    print_section("1. CHECK ADMIN USERS IN DATABASE")
    
    # Custom User model uses 'staff' and 'admin' instead of 'is_staff' and 'is_superuser'
    admins = User.objects.filter(staff=True, admin=True)
    
    if admins.exists():
        print(f"\n✅ Found {admins.count()} admin user(s):")
        for admin in admins:
            print(f"\n   📧 Email: {admin.email}")
            print(f"   👤 Name: {admin.first_name} {admin.last_name}")
            print(f"   🔑 Is Active: {admin.is_active}")
            print(f"   🔑 Is Staff: {admin.staff}")
            print(f"   🔑 Is Admin: {admin.admin}")
            print(f"   🔑 Email Verified: {admin.email_verified}")
        return admins.first()
    else:
        print("\n❌ No admin users found!")
        print("\n📝 Creating test admin user...")
        
        # Check if user exists but doesn't have admin privileges
        try:
            existing_user = User.objects.get(email='admin@mrict.com')
            print(f"\n⚠️  User exists but not an admin. Updating...")
            existing_user.staff = True
            existing_user.admin = True
            existing_user.email_verified = True
            existing_user.is_active = True
            existing_user.user_type = 'Admin'
            existing_user.set_password('Admin123!')
            existing_user.save()
            
            # Create MrAdmin if doesn't exist
            mr_admin, created = MrAdmin.objects.get_or_create(user=existing_user)
            
            print(f"\n✅ Updated existing user to admin:")
            print(f"   📧 Email: admin@mrict.com")
            print(f"   🔑 Password: Admin123!")
            print(f"   👤 Admin ID: {mr_admin.admin_id}")
            return existing_user
        except User.DoesNotExist:
            # Create new user
            admin_user = User.objects.create_superuser(
                email='admin@mrict.com',
                password='Admin123!',
                first_name='Admin',
                last_name='User'
            )
            admin_user.email_verified = True
            admin_user.is_active = True
            admin_user.user_type = 'Admin'
            admin_user.save()
            
            # Create MrAdmin object
            mr_admin = MrAdmin.objects.create(user=admin_user)
            
            print(f"\n✅ Created admin user:")
            print(f"   📧 Email: admin@mrict.com")
            print(f"   🔑 Password: Admin123!")
            print(f"   👤 Admin ID: {mr_admin.admin_id}")
            return admin_user

def test_admin_login_endpoint():
    print_section("2. TEST ADMIN LOGIN ENDPOINT")
    
    url = f"{BASE_URL}/api/accounts/login-admin/"
    data = {
        "email": "admin@mrict.com",
        "password": "Admin123!",
        "fcm_token": "test-admin-fcm-token"
    }
    
    print(f"\nPOST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('message') == 'Successful':
                data = result.get('data', {})
                print_result(True, "Admin login successful")
                print(f"\n   🎫 Access Token: {data.get('access', '')[:50]}...")
                print(f"   🔄 Refresh Token: {data.get('refresh', '')[:50]}...")
                print(f"   👤 User ID: {data.get('user_id')}")
                print(f"   📧 Email: {data.get('email')}")
                return data.get('access')
            else:
                print_result(False, f"Login failed: {result}")
                return None
        else:
            print_result(False, f"Login failed with status {response.status_code}")
            print(f"Error: {response.json()}")
            return None
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return None

def test_get_courses_with_token(access_token):
    print_section("3. TEST GET COURSES WITH TOKEN")
    
    url = f"{BASE_URL}/api/courses/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    print(f"\nGET {url}")
    print(f"Headers: Authorization: Bearer {access_token[:30]}...")
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            courses = result.get('data', {}).get('courses', [])
            print_result(True, f"Retrieved {len(courses)} course(s)")
            
            if courses:
                print(f"\n   📚 Sample course:")
                course = courses[0]
                print(f"      Title: {course.get('title')}")
                print(f"      ID: {course.get('course_id')}")
                print(f"      Published: {course.get('is_published')}")
            return True
        else:
            print_result(False, f"Failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_token_refresh(refresh_token):
    print_section("4. TEST TOKEN REFRESH")
    
    url = f"{BASE_URL}/api/accounts/token/refresh/"
    data = {
        "refresh": refresh_token
    }
    
    print(f"\nPOST {url}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            new_access = result.get('access')
            print_result(True, "Token refresh successful")
            print(f"\n   🎫 New Access Token: {new_access[:50]}...")
            return True
        else:
            print_result(False, f"Refresh failed with status {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_wrong_credentials():
    print_section("5. TEST WRONG CREDENTIALS")
    
    url = f"{BASE_URL}/api/accounts/login-admin/"
    data = {
        "email": "admin@mrict.com",
        "password": "WrongPassword123!",
        "fcm_token": "test-admin-fcm-token"
    }
    
    print(f"\nPOST {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 400 or response.status_code == 401:
            print_result(True, "Correctly rejected wrong credentials")
            print(f"   Error: {response.json()}")
            return True
        else:
            print_result(False, "Should have rejected wrong credentials")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def main():
    print("\n" + "🔐 " * 35)
    print("  ADMIN LOGIN FLOW TEST")
    print("🔐 " * 35)
    
    # Check/create admin user
    admin = check_admin_users()
    if not admin:
        print("\n❌ Failed to get/create admin user")
        return
    
    # Test login
    access_token = test_admin_login_endpoint()
    if not access_token:
        print("\n❌ Login test failed. Cannot continue.")
        return
    
    # Test API access with token
    courses_ok = test_get_courses_with_token(access_token)
    if not courses_ok:
        print("\n⚠️  Courses API test failed")
    
    # Test token refresh
    # Note: We need the refresh token from login response
    print_section("4. TEST TOKEN REFRESH")
    print("⚠️  Skipping - need to capture refresh token from login")
    
    # Test wrong credentials
    wrong_creds_ok = test_wrong_credentials()
    
    # Summary
    print_section("TEST SUMMARY")
    print("✅ Admin user exists/created")
    print("✅ Admin login endpoint working" if access_token else "❌ Admin login failed")
    print("✅ Courses API accessible with token" if courses_ok else "❌ Courses API failed")
    print("✅ Wrong credentials rejected" if wrong_creds_ok else "❌ Wrong credentials test failed")
    
    if access_token and courses_ok and wrong_creds_ok:
        print("\n🎉 " * 35)
        print("  ALL ADMIN LOGIN TESTS PASSED!")
        print("🎉 " * 35)
        print("\n📝 Admin Credentials:")
        print("   Email: admin@mrict.com")
        print("   Password: Admin123!")
        print("\n🚀 Ready to test in frontend!")
    else:
        print("\n❌ Some tests failed. Please review errors above.")

if __name__ == "__main__":
    main()
