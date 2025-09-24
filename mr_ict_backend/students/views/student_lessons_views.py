from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Lesson
from students.models import StudentCourse, StudentLesson
from students.serializers import AllStudentLessonsSerializer, StudentLessonDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_student_lesson_view(request):
    payload = {}
    data = {}
    errors = {}


    lesson_id = request.data.get('lesson_id', "")
    student_course_id = request.data.get('student_course_id', "")
  

    if not student_course_id:
        errors['student_course_id'] = ['StudentCourse ID is required.']
    if not lesson_id:
        errors['lesson_id'] = ['Lesson ID is required.']

    try:
        lesson = Lesson.objects.get(lesson_id=lesson_id)
    except:
        errors['lesson_id'] = ['Lesson does not exist.']

    try:
        student_course = StudentCourse.objects.get(id=student_course_id)
    except:
        errors['student_course_id'] = ['StudentCourse does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_lesson = StudentLesson.objects.create(
        course=student_course,
        lesson=lesson,
    
    )

    data['id'] = student_lesson.id
    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_student_lessons_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all student_lessons, excluding archived ones
    all_student_lessons = StudentLesson.objects.filter(is_archived=False)


    # If a search query is provided, filter by student_lesson name
    if search_query:
        all_student_lessons = all_student_lessons.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_student_lessons, page_size)

    try:
        paginated_student_lessons = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_student_lessons = paginator.page(1)
    except EmptyPage:
        paginated_student_lessons = paginator.page(paginator.num_pages)

    # Serialize the paginated student_lessons
    all_student_lessons_serializer = AllStudentLessonsSerializer(paginated_student_lessons, many=True)

    # Prepare the response data
    data['student_lessons'] = all_student_lessons_serializer.data
    data['pagination'] = {
        'page_number': paginated_student_lessons.number,
        'total_pages': paginator.num_pages,
        'next': paginated_student_lessons.next_page_number() if paginated_student_lessons.has_next() else None,
        'previous': paginated_student_lessons.previous_page_number() if paginated_student_lessons.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_student_lesson_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["StudentCourseLesson id required"]

    try:
        student_lesson = StudentLesson.objects.get(id=id)
    except StudentLesson.DoesNotExist:
        errors['id'] = ['StudentCourseLesson does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_lesson_serializer = StudentLessonDetailsSerializer(student_lesson, many=False)
    if student_lesson_serializer:
        student_lesson = student_lesson_serializer.data


    payload['message'] = "Successful"
    payload['data'] = student_lesson

    return Response(payload, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_student_lesson(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['StudentCourseLesson ID is required.']

        try:
            student_lesson = StudentLesson.objects.get(id=id)
        except:
            errors['id'] = ['StudentCourseLesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student_lesson.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




