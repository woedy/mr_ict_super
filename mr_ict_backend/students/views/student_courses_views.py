from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Course
from students.models import Student, StudentCourse
from students.serializers import AllStudentCoursesSerializer, StudentCourseDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_student_course_view(request):
    payload = {}
    data = {}
    errors = {}


    course_id = request.data.get('course_id', "")
    student_id = request.data.get('student_id', "")
  

    if not student_id:
        errors['student_id'] = ['Student ID is required.']
    if not course_id:
        errors['course_id'] = ['Course ID is required.']

    try:
        course = Course.objects.get(course_id=course_id)
    except:
        errors['course_id'] = ['Course does not exist.']

    try:
        student = Student.objects.get(student_id=student_id)
    except:
        errors['student_id'] = ['Student does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_course = StudentCourse.objects.create(
        student=student,
        course=course,
    
    )

    data['id'] = student_course.id
    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_student_courses_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all student_courses, excluding archived ones
    all_student_courses = StudentCourse.objects.filter(is_archived=False)


    # If a search query is provided, filter by student_course name
    if search_query:
        all_student_courses = all_student_courses.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_student_courses, page_size)

    try:
        paginated_student_courses = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_student_courses = paginator.page(1)
    except EmptyPage:
        paginated_student_courses = paginator.page(paginator.num_pages)

    # Serialize the paginated student_courses
    all_student_courses_serializer = AllStudentCoursesSerializer(paginated_student_courses, many=True)

    # Prepare the response data
    data['student_courses'] = all_student_courses_serializer.data
    data['pagination'] = {
        'page_number': paginated_student_courses.number,
        'total_pages': paginator.num_pages,
        'next': paginated_student_courses.next_page_number() if paginated_student_courses.has_next() else None,
        'previous': paginated_student_courses.previous_page_number() if paginated_student_courses.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_student_course_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["StudentCourse id required"]

    try:
        student_course = StudentCourse.objects.get(id=id)
    except StudentCourse.DoesNotExist:
        errors['id'] = ['StudentCourse does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_course_serializer = StudentCourseDetailsSerializer(student_course, many=False)
    if student_course_serializer:
        student_course = student_course_serializer.data


    payload['message'] = "Successful"
    payload['data'] = student_course

    return Response(payload, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_student_course(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['StudentCourse ID is required.']

        try:
            student_course = StudentCourse.objects.get(id=id)
        except:
            errors['id'] = ['StudentCourse does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student_course.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




