from datetime import datetime
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

from courses.models import Motivation
from students.models import Student, StudentActivity, StudentBadge, StudentChallenge, StudentCourse
from students.serializers import AllStudentsSerializer, StudentDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_student_view(request):
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
            errors['name'] = ['Student Name required.']

        if not contact_email:
            errors['contact_email'] = ['Contact Email is required.']
            
        if not phone:
            errors['phone'] = ['Phone is required.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_student = Student.objects.create(
            name=name,
            contact_email=contact_email,
            logo=logo,
            phone=phone,
        )


        data['student_id'] = new_student.student_id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_students_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all students, excluding archived ones
    all_students = Student.objects.filter(is_archived=False)


    # If a search query is provided, filter by student name
    if search_query:
        all_students = all_students.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(school__name__icontains=search_query) 
            ).distinct()


    # Paginate the result
    paginator = Paginator(all_students, page_size)

    try:
        paginated_students = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_students = paginator.page(1)
    except EmptyPage:
        paginated_students = paginator.page(paginator.num_pages)

    # Serialize the paginated students
    all_students_serializer = AllStudentsSerializer(paginated_students, many=True)

    # Prepare the response data
    data['students'] = all_students_serializer.data
    data['pagination'] = {
        'page_number': paginated_students.number,
        'total_pages': paginator.num_pages,
        'next': paginated_students.next_page_number() if paginated_students.has_next() else None,
        'previous': paginated_students.previous_page_number() if paginated_students.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_student_details_view(request):
    payload = {}
    data = {}
    errors = {}

    student_id = request.query_params.get('student_id', None)

    if not student_id:
        errors['student_id'] = ["Student id required"]

    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        errors['student_id'] = ['Student does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    #student_serializer = StudentDetailsSerializer(student, many=False)
    #if student_serializer:
    #    student = student_serializer.data

    challenges = StudentChallenge.objects.filter(student=student).filter(completed=True)
    current_coures = StudentCourse.objects.filter(student=student).order_by("id")[:3]
    my_coures = StudentCourse.objects.filter(student=student).order_by("id")
    my_acheivements = StudentBadge.objects.filter(student=student)
    recent_activities = StudentActivity.objects.filter(student=student).order_by("-created_at")[:3]

    
    motivations = Motivation.objects.all()

    # Student Data
    
    data['name'] = student.user.first_name + " " + student.user.last_name
    data['email'] = student.user.email
    data['avatarUrl'] = student.user.photo.url
    data['school'] = student.school.name
    data['xp'] = student.epz
    data['progress'] = student.progress
    data['challengesSolved'] = challenges.count()
    data['daysActive'] = student.days_active

    myCoures = []
    for course in my_coures:
        item =  {
            "name": course.course.title,
            "level": course.level,
            "progress": course.progress_percent,
            "lastSeen": course.last_seen.strftime("%B %d, %Y")

        }
        myCoures.append(item)

    data['myCoures'] = myCoures


    languages = []
    for course in my_coures:
        language =  {
            "name": course.course.title,
            "level": course.level
        }
        languages.append(language)

    data['languages'] = languages
    
    achievements = []
    for acheivement in my_acheivements:
        ach =  {
            "name": acheivement.badge.badge_name,
            "image": acheivement.badge.image.url,
        }
        achievements.append(ach)
    
    data['achievements'] = achievements

    motivation = motivations.first()
    data['motivation'] = motivation.motivation

    currentCourses = []
    for current_course in current_coures:
        cors =  {
            "name": current_course.course.title,
            "progress": current_course.progress_percent,
            "lastSeen": current_course.last_seen.strftime("%B %d, %Y")

        }
        currentCourses.append(cors)

    data['currentCourses'] = currentCourses

    
    recentActivities = []
    for activity in recent_activities:
        act = {
            "action": activity.action,
            "name": activity.name,
            "time": activity.created_at,
        }
        recentActivities.append(act)

    data['recentActivities'] = recentActivities


    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



def parse_last_seen(ts):
    try:
        return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%B %d, %Y")
    except ValueError:
        return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ").strftime("%B %d, %Y")




@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_student(request):
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
            student = Student.objects.get(id=id)
        except:
            errors['student_id'] = ['Student does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            student.name = name
        if description:
            student.description = description
        if photo:
            student.photo = photo

        student.save()

        data["name"] = student.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_student(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        student_id = request.data.get('student_id', "")

        if not student_id:
            errors['student_id'] = ['Student ID is required.']

        try:
            student = Student.objects.get(student_id=student_id)
        except:
            errors['student_id'] = ['Student does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student.is_archived = True
        student.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_student(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        student_id = request.data.get('student_id', "")

        if not student_id:
            errors['student_id'] = ['Student ID is required.']

        try:
            student = Student.objects.get(student_id=student_id)
        except:
            errors['student_id'] = ['Student does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student.is_archived = False
        student.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_students_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_students = Student.objects.all().filter(is_archived=True)


    if search_query:
        all_students = all_students.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_students, page_size)

    try:
        paginated_students = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_students = paginator.page(1)
    except EmptyPage:
        paginated_students = paginator.page(paginator.num_pages)

    all_students_serializer = AllStudentsSerializer(paginated_students, many=True)


    data['students'] = all_students_serializer.data
    data['pagination'] = {
        'page_number': paginated_students.number,
        'total_pages': paginator.num_pages,
        'next': paginated_students.next_page_number() if paginated_students.has_next() else None,
        'previous': paginated_students.previous_page_number() if paginated_students.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_student(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        student_id = request.data.get('student_id', "")

        if not student_id:
            errors['student_id'] = ['Student ID is required.']

        try:
            student = Student.objects.get(student_id=student_id)
        except:
            errors['student_id'] = ['Student does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




