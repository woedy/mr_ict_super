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
from students.models import LessonNote, StudentCourse, StudentLesson
from students.serializers import AllLessonNoteSerializer, AllStudentLessonsSerializer, LessonNoteDetailsSerializer, StudentLessonDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_student_lesson_assignment_view(request):
    payload = {}
    data = {}
    errors = {}


    student_lesson_id = request.data.get('student_lesson_id', "")
    assignment = request.data.get('assignment', "")
  

    if not assignment:
        errors['assignment'] = ['Note is required.']

    if not student_lesson_id:
        errors['student_lesson_id'] = [' Student Lesson ID is required.']

    try:
        lesson = StudentLesson.objects.get(id=student_lesson_id)
    except:
        errors['student_lesson_id'] = ['Student Lesson does not exist.']


    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_lesson_assignment = LessonNote.objects.create(
        lesson=lesson,
        assignment=assignment,
    
    )

    data['id'] = student_lesson_assignment.id
    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_student_lesson_assignments_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all student_lesson_assignments, excluding archived ones
    all_student_lesson_assignments = LessonNote.objects.filter(is_archived=False)
    print(all_student_lesson_assignments)

    # If a search query is provided, filter by student_lesson_assignment name
    if search_query:
        all_student_lesson_assignments = all_student_lesson_assignments.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_student_lesson_assignments, page_size)

    try:
        paginated_student_lesson_assignments = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_student_lesson_assignments = paginator.page(1)
    except EmptyPage:
        paginated_student_lesson_assignments = paginator.page(paginator.num_pages)

    # Serialize the paginated student_lesson_assignments
    all_student_lesson_assignments_serializer = AllLessonNoteSerializer(paginated_student_lesson_assignments, many=True)

    # Prepare the response data
    data['student_lesson_assignments'] = all_student_lesson_assignments_serializer.data
    data['pagination'] = {
        'page_number': paginated_student_lesson_assignments.number,
        'total_pages': paginator.num_pages,
        'next': paginated_student_lesson_assignments.next_page_number() if paginated_student_lesson_assignments.has_next() else None,
        'previous': paginated_student_lesson_assignments.previous_page_number() if paginated_student_lesson_assignments.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_student_lesson_assignment_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["StudentCourseLesson id required"]

    try:
        student_lesson_assignment = LessonNote.objects.get(id=id)
    except:
        errors['id'] = ['StudentCourseLesson does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    student_lesson_assignment_serializer = LessonNoteDetailsSerializer(student_lesson_assignment, many=False)
    if student_lesson_assignment_serializer:
        student_lesson_assignment = student_lesson_assignment_serializer.data


    payload['message'] = "Successful"
    payload['data'] = student_lesson_assignment

    return Response(payload, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_student_lesson_assignment(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['StudentCourseLesson ID is required.']

        try:
            student_lesson_assignment = LessonNote.objects.get(id=id)
        except:
            errors['id'] = ['StudentCourseLesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        student_lesson_assignment.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




