from rest_framework import serializers
from .models import School


class AllSchoolsSerializer(serializers.ModelSerializer):


    class Meta:
        model = School
        fields = ["school_id", "name", "contact_email", "contact_person",  "district", "logo","location_name", "phone","region", "active", "created_at"]

class SchoolDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"
