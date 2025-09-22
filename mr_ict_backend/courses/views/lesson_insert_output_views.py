from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Lesson, LessonInsertOutput
from courses.views.serializers import AllLessonInsertOutputsSerializer, LessonInsertOutputDetailsSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_lesson_insert_output_view(request):
    payload = {}
    data = {}
    errors = {}


    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")
        content = request.data.get('content', "")
        timestamp = request.data.get('timestamp', "")
        duration = request.data.get('duration', "")
        window_position = request.data.get('window_position', "")
        window_dimension = request.data.get('window_dimension', "")

        # Validate input
        if not lesson_id:
            errors['lesson_id'] = ['Lesson Output Name required.']

        if not content:
            errors['content'] = ['Output Content is required.']


        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_lesson_insert_output = LessonInsertOutput.objects.create(
            lesson=lesson,
            timestamp=timestamp,
            content=content,
            duration=duration,
            window_position=window_position,
            window_dimension=window_dimension,
     
        )


        data['id'] = new_lesson_insert_output.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_lesson_insert_outputs_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lesson_outputs, excluding archived ones
    all_lesson_outputs = LessonInsertOutput.objects.filter(is_archived=False)


    # If a search query is provided, filter by lesson_output name
    if search_query:
        all_lesson_outputs = all_lesson_outputs.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_lesson_outputs, page_size)

    try:
        paginated_lesson_outputs = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_outputs = paginator.page(1)
    except EmptyPage:
        paginated_lesson_outputs = paginator.page(paginator.num_pages)

    # Serialize the paginated lesson_outputs
    all_lesson_outputs_serializer = AllLessonInsertOutputsSerializer(paginated_lesson_outputs, many=True)

    # Prepare the response data
    data['insert_outputs'] = all_lesson_outputs_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_outputs.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_outputs.next_page_number() if paginated_lesson_outputs.has_next() else None,
        'previous': paginated_lesson_outputs.previous_page_number() if paginated_lesson_outputs.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_lesson_insert_output_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["Lesson Insert Output id required"]

    try:
        lesson_output = LessonInsertOutput.objects.get(id=id)
    except:
        errors['id'] = ['Lesson Insert Output does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson_output_serializer = LessonInsertOutputDetailsSerializer(lesson_output, many=False)
    if lesson_output_serializer:
        lesson_output = lesson_output_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson_output

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_lesson_output(request):
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
            lesson_output = LessonInsertOutput.objects.get(id=id)
        except:
            errors['id'] = ['LessonOutput does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            lesson_output.name = name
        if description:
            lesson_output.description = description
        if photo:
            lesson_output.photo = photo

        lesson_output.save()

        data["name"] = lesson_output.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_lesson_insert_output(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonOutput ID is required.']

        try:
            lesson_output = LessonInsertOutput.objects.get(id=id)
        except:
            errors['id'] = ['LessonOutput does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_output.is_archived = True
        lesson_output.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_lesson_insert_output(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonOutput ID is required.']

        try:
            lesson_output = LessonInsertOutput.objects.get(id=id)
        except:
            errors['id'] = ['LessonOutput does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_output.is_archived = False
        lesson_output.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_lesson_insert_output_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lesson_outputs = LessonInsertOutput.objects.all().filter(is_archived=True)


    if search_query:
        all_lesson_outputs = all_lesson_outputs.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_lesson_outputs, page_size)

    try:
        paginated_lesson_outputs = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_outputs = paginator.page(1)
    except EmptyPage:
        paginated_lesson_outputs = paginator.page(paginator.num_pages)

    all_lesson_outputs_serializer = AllLessonInsertOutputsSerializer(paginated_lesson_outputs, many=True)


    data['insert_outputs'] = all_lesson_outputs_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_outputs.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_outputs.next_page_number() if paginated_lesson_outputs.has_next() else None,
        'previous': paginated_lesson_outputs.previous_page_number() if paginated_lesson_outputs.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_lesson_insert_output(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson Insert Output ID is required.']

        try:
            lesson_output = LessonInsertOutput.objects.get(id=id)
        except:
            errors['id'] = ['Lesson insert Output does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_output.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




