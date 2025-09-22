from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Course, Lesson
from courses.serializers import AllLessonsSerializer, LessonDetailsSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_lesson_view(request):
    payload = {}
    data = {}
    errors = {}


    course_id = request.data.get('course_id', "")
    title = request.data.get('title', "")
    description = request.data.get('description', "")
    order = request.data.get('order', None)

    if not title:
        errors['title'] = ['Lesson title is required.']
    if not course_id:
        errors['course_id'] = ['Course ID is required.']
    if order is None:
        errors['order'] = ['Order is required.']

    try:
        course = Course.objects.get(course_id=course_id)
    except Course.DoesNotExist:
        errors['course_id'] = ['Course does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson = Lesson.objects.create(
        title=title,
        description=description,
        order=order,
        course=course
    )

    data['lesson_id'] = lesson.lesson_id
    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_lessons_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lessons, excluding archived ones
    all_lessons = Lesson.objects.filter(is_archived=False)


    # If a search query is provided, filter by lesson name
    if search_query:
        all_lessons = all_lessons.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_lessons, page_size)

    try:
        paginated_lessons = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lessons = paginator.page(1)
    except EmptyPage:
        paginated_lessons = paginator.page(paginator.num_pages)

    # Serialize the paginated lessons
    all_lessons_serializer = AllLessonsSerializer(paginated_lessons, many=True)

    # Prepare the response data
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
@authentication_classes([TokenAuthentication, ])
def get_lesson_details_view(request):
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

    lesson_serializer = LessonDetailsSerializer(lesson, many=False)
    if lesson_serializer:
        lesson = lesson_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_lesson(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':

        lesson_id = request.data.get('lesson_id', "")
        title = request.data.get('title', "")
        description = request.data.get('description', "")
        order = request.data.get('order', None)

        if not title:
            errors['title'] = ['Lesson title is required.']
        if order is None:
            errors['order'] = ['Order is required.']

      

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if title:
            lesson.title = title
        if description:
            lesson.description = description
        if order:
            lesson.order = order

        lesson.save()

        data["title"] = lesson.title




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_lesson(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")

        if not lesson_id:
            errors['lesson_id'] = ['Lesson ID is required.']

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson.is_archived = True
        lesson.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_lesson(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")

        if not lesson_id:
            errors['lesson_id'] = ['Lesson ID is required.']

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson.is_archived = False
        lesson.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_lessons_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lessons = Lesson.objects.all().filter(is_archived=True)


    if search_query:
        all_lessons = all_lessons.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_lessons, page_size)

    try:
        paginated_lessons = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lessons = paginator.page(1)
    except EmptyPage:
        paginated_lessons = paginator.page(paginator.num_pages)

    all_lessons_serializer = AllLessonsSerializer(paginated_lessons, many=True)


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



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_lesson(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")

        if not lesson_id:
            errors['lesson_id'] = ['Lesson ID is required.']

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




