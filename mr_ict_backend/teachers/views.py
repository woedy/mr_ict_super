from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


import random
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from teachers.models import Teacher
from teachers.serializers import AllTeachersSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_teacher_view(request):
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
            errors['name'] = ['Teacher Name required.']

        if not contact_email:
            errors['contact_email'] = ['Contact Email is required.']
            
        if not phone:
            errors['phone'] = ['Phone is required.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_teacher = Teacher.objects.create(
            name=name,
            contact_email=contact_email,
            logo=logo,
            phone=phone,
        )


        data['teacher_id'] = new_teacher.teacher_id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_teachers_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all teachers, excluding archived ones
    all_teachers = Teacher.objects.filter(is_archived=False)


    # If a search query is provided, filter by teacher name
    if search_query:
        all_teachers = all_teachers.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_teachers, page_size)

    try:
        paginated_teachers = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_teachers = paginator.page(1)
    except EmptyPage:
        paginated_teachers = paginator.page(paginator.num_pages)

    # Serialize the paginated teachers
    all_teachers_serializer = AllTeachersSerializer(paginated_teachers, many=True)

    # Prepare the response data
    data['teachers'] = all_teachers_serializer.data
    data['pagination'] = {
        'page_number': paginated_teachers.number,
        'total_pages': paginator.num_pages,
        'next': paginated_teachers.next_page_number() if paginated_teachers.has_next() else None,
        'previous': paginated_teachers.previous_page_number() if paginated_teachers.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_teacher_details_view(request):
    payload = {}
    data = {}
    errors = {}

    teacher_id = request.query_params.get('teacher_id', None)

    if not teacher_id:
        errors['teacher_id'] = ["Teacher id required"]

    try:
        teacher = Teacher.objects.get(teacher_id=teacher_id)
    except Teacher.DoesNotExist:
        errors['teacher_id'] = ['Teacher does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    teacher_serializer = TeacherDetailsSerializer(teacher, many=False)
    if teacher_serializer:
        teacher = teacher_serializer.data


    payload['message'] = "Successful"
    payload['data'] = teacher

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_teacher(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")
        name = request.data.get('name', "")
        description = request.data.get('description', "")
        photo = request.data.get('photo', "")


        if not name:
            errors['name'] = ['Name is required.']

        if not id:
            errors['id'] = ['ID is required.']



        try:
            teacher = Teacher.objects.get(id=id)
        except:
            errors['teacher_id'] = ['Teacher does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            teacher.name = name
        if description:
            teacher.description = description
        if photo:
            teacher.photo = photo

        teacher.save()

        data["name"] = teacher.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_teacher(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        teacher_id = request.data.get('teacher_id', "")

        if not teacher_id:
            errors['teacher_id'] = ['Teacher ID is required.']

        try:
            teacher = Teacher.objects.get(teacher_id=teacher_id)
        except:
            errors['teacher_id'] = ['Teacher does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        teacher.is_archived = True
        teacher.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_teacher(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        teacher_id = request.data.get('teacher_id', "")

        if not teacher_id:
            errors['teacher_id'] = ['Teacher ID is required.']

        try:
            teacher = Teacher.objects.get(teacher_id=teacher_id)
        except:
            errors['teacher_id'] = ['Teacher does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        teacher.is_archived = False
        teacher.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_teachers_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_teachers = Teacher.objects.all().filter(is_archived=True)


    if search_query:
        all_teachers = all_teachers.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_teachers, page_size)

    try:
        paginated_teachers = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_teachers = paginator.page(1)
    except EmptyPage:
        paginated_teachers = paginator.page(paginator.num_pages)

    all_teachers_serializer = AllTeachersSerializer(paginated_teachers, many=True)


    data['food_categories'] = all_teachers_serializer.data
    data['pagination'] = {
        'page_number': paginated_teachers.number,
        'total_pages': paginator.num_pages,
        'next': paginated_teachers.next_page_number() if paginated_teachers.has_next() else None,
        'previous': paginated_teachers.previous_page_number() if paginated_teachers.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_teacher(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        teacher_id = request.data.get('teacher_id', "")

        if not teacher_id:
            errors['teacher_id'] = ['Teacher ID is required.']

        try:
            teacher = Teacher.objects.get(teacher_id=teacher_id)
        except:
            errors['teacher_id'] = ['Teacher does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        teacher.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




