"""
Auto-verify test user email for development testing
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

TEST_EMAIL = "testuser@example.com"

try:
    user = User.objects.get(email=TEST_EMAIL)
    print(f"Found user: {user.email}")
    print(f"Email Token: {user.email_token}")
    print(f"Email Verified: {user.email_verified}")
    
    if not user.email_verified:
        user.email_verified = True
        user.is_active = True
        user.save()
        print(f"\n✅ Email verified for {user.email}")
    else:
        print(f"\n✅ Email already verified for {user.email}")
        
except User.DoesNotExist:
    print(f"❌ User {TEST_EMAIL} not found")
