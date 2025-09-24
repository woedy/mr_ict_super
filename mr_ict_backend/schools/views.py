from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


import random
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from schools.models import School
from schools.serializers import AllSchoolsSerializer, SchoolDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_school_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        name = request.data.get('name', "")
        contact_email = request.data.get('contact_email', "")
        phone = request.data.get('phone', "")
        logo = request.data.get('logo', "")

        # Validate input
        if not name:
            errors['name'] = ['School Name required.']

        if not contact_email:
            errors['contact_email'] = ['Contact Email is required.']
            
        if not phone:
            errors['phone'] = ['Phone is required.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique phone numbers
        new_school = School.objects.create(
            name=name,
            contact_email=contact_email,
            logo=logo,
            phone=phone,
        )


        data['school_id'] = new_school.school_id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_all_schools_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all schools, excluding archived ones
    all_schools = School.objects.filter(is_archived=False)


    # If a search query is provided, filter by school name
    if search_query:
        all_schools = all_schools.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_schools, page_size)

    try:
        paginated_schools = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_schools = paginator.page(1)
    except EmptyPage:
        paginated_schools = paginator.page(paginator.num_pages)

    # Serialize the paginated schools
    all_schools_serializer = AllSchoolsSerializer(paginated_schools, many=True)

    # Prepare the response data
    data['schools'] = all_schools_serializer.data
    data['pagination'] = {
        'page_number': paginated_schools.number,
        'total_pages': paginator.num_pages,
        'next': paginated_schools.next_page_number() if paginated_schools.has_next() else None,
        'previous': paginated_schools.previous_page_number() if paginated_schools.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([AllowAny, ])
@authentication_classes([])
def get_school_details_view(request):
    payload = {}
    data = {}
    errors = {}

    school_id = request.query_params.get('school_id', None)

    if not school_id:
        errors['school_id'] = ["School id required"]

    try:
        school = School.objects.get(school_id=school_id)
    except School.DoesNotExist:
        errors['school_id'] = ['School does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    school_serializer = SchoolDetailsSerializer(school, many=False)
    if school_serializer:
        school = school_serializer.data


    payload['message'] = "Successful"
    payload['data'] = school

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def edit_school(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        school_id = request.data.get('school_id', "")
        name = request.data.get('name', "")
        contact_email = request.data.get('contact_email', "")
        phone = request.data.get('phone', "")
        logo = request.data.get('logo', "")

        if not name:
            errors['name'] = ['Name is required.']

        if not school_id:
            errors['school_id'] = ['School ID is required.']



        try:
            school = School.objects.get(school_id=school_id)
        except:
            errors['school_id'] = ['School does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            school.name = name
        if contact_email:
            school.contact_email = contact_email
        if logo:
            school.logo = logo
        if phone:
            school.phone = phone

        school.save()

        data["name"] = school.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def archive_school(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        school_id = request.data.get('school_id', "")

        if not school_id:
            errors['school_id'] = ['School ID is required.']

        try:
            school = School.objects.get(school_id=school_id)
        except:
            errors['school_id'] = ['School does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        school.is_archived = True
        school.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def unarchive_school(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        school_id = request.data.get('school_id', "")

        if not school_id:
            errors['school_id'] = ['School ID is required.']

        try:
            school = School.objects.get(school_id=school_id)
        except:
            errors['school_id'] = ['School does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        school.is_archived = False
        school.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_all_archived_schools_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_schools = School.objects.all().filter(is_archived=True)


    if search_query:
        all_schools = all_schools.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_schools, page_size)

    try:
        paginated_schools = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_schools = paginator.page(1)
    except EmptyPage:
        paginated_schools = paginator.page(paginator.num_pages)

    all_schools_serializer = AllSchoolsSerializer(paginated_schools, many=True)


    data['schools'] = all_schools_serializer.data
    data['pagination'] = {
        'page_number': paginated_schools.number,
        'total_pages': paginator.num_pages,
        'next': paginated_schools.next_page_number() if paginated_schools.has_next() else None,
        'previous': paginated_schools.previous_page_number() if paginated_schools.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_school(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        school_id = request.data.get('school_id', "")

        if not school_id:
            errors['school_id'] = ['School ID is required.']

        try:
            school = School.objects.get(school_id=school_id)
        except:
            errors['school_id'] = ['School does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        school.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




