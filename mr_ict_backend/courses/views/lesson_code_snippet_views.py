from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Lesson, LessonCodeSnippet
from courses.views.serializers import AllLessonCodeSnippetsSerializer, LessonCodeSnippetDetailsSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_lesson_code_snippet_view(request):
    payload = {}
    data = {}
    errors = {}


    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")
        code_content = request.data.get('code_content', "")
        timestamp = request.data.get('timestamp', "")
        is_highlight = request.data.get('is_highlight', "")
        cursor_position = request.data.get('cursor_position', "")
        scroll_position = request.data.get('scroll_position', "")

        # Validate input
        if not lesson_id:
            errors['lesson_id'] = ['Lesson Code Snippet Name required.']

        if not code_content:
            errors['code_content'] = ['Code Content is required.']


        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_lesson_code_snippet = LessonCodeSnippet.objects.create(
            lesson=lesson,
            timestamp=timestamp,
            code_content=code_content,
            is_highlight=is_highlight,
            cursor_position=cursor_position,
            scroll_position=scroll_position,
     
        )


        data['id'] = new_lesson_code_snippet.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_lesson_code_snippets_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lesson_outputs, excluding archived ones
    all_lesson_outputs = LessonCodeSnippet.objects.filter(is_archived=False)


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
    all_lesson_outputs_serializer = AllLessonCodeSnippetsSerializer(paginated_lesson_outputs, many=True)

    # Prepare the response data
    data['code_snippets'] = all_lesson_outputs_serializer.data
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
@authentication_classes([JWTAuthentication, ])
def get_lesson_code_snippet_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["Lesson Code Snippet id required"]

    try:
        lesson_output = LessonCodeSnippet.objects.get(id=id)
    except:
        errors['id'] = ['Lesson Code Snippet does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson_output_serializer = LessonCodeSnippetDetailsSerializer(lesson_output, many=False)
    if lesson_output_serializer:
        lesson_output = lesson_output_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson_output

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
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
            lesson_output = LessonCodeSnippet.objects.get(id=id)
        except:
            errors['id'] = ['Lesson Code Snippet does not exist.']

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
@authentication_classes([JWTAuthentication, ])
def archive_lesson_code_snippet(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson Code Snippet ID is required.']

        try:
            lesson_output = LessonCodeSnippet.objects.get(id=id)
        except:
            errors['id'] = ['Lesson Code Snippet does not exist.']


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
@authentication_classes([JWTAuthentication, ])
def unarchive_lesson_code_snippet(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson Code Snipptet ID is required.']

        try:
            lesson_output = LessonCodeSnippet.objects.get(id=id)
        except:
            errors['id'] = ['Lesson Code Snippet does not exist.']


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
@authentication_classes([JWTAuthentication, ])
def get_all_archived_lesson_code_snippet_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lesson_outputs = LessonCodeSnippet.objects.all().filter(is_archived=True)


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

    all_lesson_outputs_serializer = AllLessonCodeSnippetsSerializer(paginated_lesson_outputs, many=True)


    data['code_snippets'] = all_lesson_outputs_serializer.data
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
@authentication_classes([JWTAuthentication, ])
def delete_lesson_code_snippet(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson Code Snippet ID is required.']

        try:
            lesson_output = LessonCodeSnippet.objects.get(id=id)
        except:
            errors['id'] = ['Lesson Code snippet does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_output.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




