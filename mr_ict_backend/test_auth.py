#!/usr/bin/env python
"""
Simple test script to verify the authentication endpoints work correctly.
"""
import os
import sys
import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Setup Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
os.environ['ALLOWED_HOSTS'] = 'testserver,localhost,127.0.0.1'
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from schools.models import School

# Create test data
try:
    school = School.objects.get(school_id="TEST-SCHOOL-3")
except School.DoesNotExist:
    school = School.objects.create(
        school_id="TEST-SCHOOL-3",
        name="Test School 3",
        region="Greater Accra",
        district="Accra",
        phone="1234567890",
        contact_person="Test Coordinator",
        contact_email="test3@example.com",
    )

# Test registration
client = Client()
registration_data = {
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+233123456789",
    "country": "Ghana",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "school_id": school.school_id,
}

print("Testing student registration...")
response = client.post('/api/accounts/register-student/', registration_data, content_type='application/json')

if response.status_code == 200:
    print("SUCCESS: Registration successful!")
    data = response.json()
    print("   User ID: {}".format(data['data']['user_id']))
    print("   Requires onboarding: {}".format(data['data']['requires_onboarding']))
else:
    print("FAILED: Registration failed!")
    print("   Status: {}".format(response.status_code))
    if hasattr(response, 'data'):
        print("   Error: {}".format(response.data))

print("\nTest completed!")
