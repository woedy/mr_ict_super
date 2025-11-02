"""
Create a default school for student registration
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from schools.models import School

# Create or get default school
school, created = School.objects.get_or_create(
    name="Mr ICT Academy",
    defaults={
        'region': 'Greater Accra',
        'district': 'Accra Metropolitan',
        'phone': '+233000000000',
        'contact_email': 'info@mrict.academy',
        'active': True,
    }
)

if created:
    print(f"✅ Created default school: {school.name} (ID: {school.school_id})")
else:
    print(f"✅ Default school already exists: {school.name} (ID: {school.school_id})")

print(f"\nSchool ID to use in frontend: {school.school_id}")
