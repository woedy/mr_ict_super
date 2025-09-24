
import json
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from courses.models import Course, Lesson, LessonAssignment, LessonCodeSnippet, LessonIntroVideo, LessonVideo
from courses.serializers import AllLessonsSerializer, LessonDetailsSerializer, LessonIntroVideoSerializer, LessonVideoSerializer
from students.models import LessonNote, LessonNoteSnippet

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_course_info_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    course_id = request.query_params.get('course_id', '')
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    
    if not course_id:
        errors['course_id'] = ['Course ID is required.']


    try:
        course_info = Course.objects.get(course_id=course_id)
    except:
        errors['course_id'] = ['Course does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)
    
    lessons = Lesson.objects.filter(is_archived=True, course=course_info)

    if search_query:
        lessons = lessons.filter(
            Q(title__icontains=search_query) 
        
        ).distinct() 


    paginator = Paginator(search_query, page_size)

    try:
        paginated_lessons = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lessons = paginator.page(1)
    except EmptyPage:
        paginated_lessons = paginator.page(paginator.num_pages)

    all_lessons_serializer = AllLessonsSerializer(paginated_lessons, many=True)

    # Prepare the response data
    data['course_info'] = {
        'title': course_info.title,
        'description': course_info.description,
    }

    data['lessons'] = all_lessons_serializer.data
    data['pagination'] = {
        'page_number': paginated_lessons.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lessons.next_page_number() if paginated_lessons.has_next() else None,
        'previous': paginated_lessons.previous_page_number() if paginated_lessons.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_interactive_coding_view(request):
    payload = {}
    data = {}
    errors = {}

    lesson_id = request.query_params.get('lesson_id', None)

    if not lesson_id:
        errors['lesson_id'] = ["Lesson id required"]

    try:
        lesson = Lesson.objects.get(lesson_id=lesson_id)
    except Lesson.DoesNotExist:
        errors['lesson_id'] = ['Lesson does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)
    

    ### Lesson Info ###
    lesson_serializer = LessonDetailsSerializer(lesson, many=False)
    if lesson_serializer:
        lesson = lesson_serializer.data

    data['lesson_details'] = lesson

    
    ### Lesson Intro ###
    lesson_intro = LessonIntroVideo.objects.get(lesson=lesson)
    
    if lesson_intro != None:
        lesson_intro_serializer = LessonIntroVideoSerializer(lesson_intro, many=False)
        if lesson_intro_serializer:
            lesson_intro = lesson_intro_serializer.data

        data['lesson_intro'] = lesson_intro
    else:
        pass


    ### Lesson video ###
    lesson_video = LessonVideo.objects.get(lesson=lesson)
    
    if lesson_video != None:
        lesson_video_serializer = LessonVideoSerializer(lesson_video, many=False)
        if lesson_video_serializer:
            lesson_video = lesson_video_serializer.data

        data['lesson_video'] = lesson_video
    else:
        pass

    ### Lesson Code Snippets ###
    lesson_code_snippet = LessonCodeSnippet.objects.get(lesson=lesson)
    
    if lesson_code_snippet != None:
        lesson_code_snippet_serializer = LessonVideoSerializer(lesson_code_snippet, many=True)
        if lesson_code_snippet_serializer:
            lesson_code_snippet = lesson_code_snippet_serializer.data

        data['lesson_code_snippets'] = lesson_code_snippet
    else:
        pass



    ### Lesson Assignments ###
    lesson_assignments = LessonCodeSnippet.objects.get(lesson=lesson)
    
    if lesson_assignments != None:
        lesson_assignments_serializer = LessonAssignment(lesson_assignments, many=True)
        if lesson_assignments_serializer:
            lesson_assignments = lesson_assignments_serializer.data

        data['lesson_assignments'] = lesson_assignments_serializer
    else:
        pass



    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)







@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def save_lesson_note(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        user_id = request.data.get('user_id', "")
        lesson_id = request.data.get('lesson_id', "")

        timestamp = request.data.get('timestamp', "")
        snippet_interacted_with_id = request.data.get('snippet_interacted_with_id', "")
        edited_code_content = request.data.get('edited_code_content', "")

        started_at = request.data.get('started_at', "")



        if not user_id:
            errors['user_id'] = ['User ID is required.']

        if not lesson_id:
            errors['lesson_id'] = ['Lesson ID is required.']

        if not snippet_interacted_with_id:
            errors['snippet_interacted_with_id'] = ['Code Snippet ID is required.']

        if not edited_code_content:
            errors['edited_code_content'] = ['Edited Code is required.']

        if not started_at:
            errors['started_at'] = ['Description is required.']

        if not timestamp:
            errors['timestamp'] = ['Timestamp is required.']


        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except Lesson.DoesNotExist:
            errors['lesson_id'] = ['Lesson does not exist.']

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            errors['user_id'] = ['User does not exist.']

        try:
            student = Student.objects.get(user=user)
        except:
            errors['user_id'] = ['Student does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)
        
        code_snippet = LessonCodeSnippet.objects.get(timestamp=timestamp)


        note = LessonNote.objects.create(
            student=student,
            lesson=lesson
        )


        note_snippet = LessonNoteSnippet.objects.create(
            note=note,
            snippet_interacted_with=code_snippet,
            edited_code_content=edited_code_content,
            started_at=started_at,
            ended_at=timezone.now()
        )


        

        data["note_id"] = note.id


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)
