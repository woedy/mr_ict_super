from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Lesson, LessonAssignment
from courses.views.serializers import AllLessonAssignmentsSerializer, LessonAssignmentDetailsSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_lesson_assignment_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")
        title = request.data.get('title', "")
        instructions = request.data.get('instructions', "")
        code_template = request.data.get('code_template', "")
        expected_output = request.data.get('expected_output', "")

        # Validate input
        if not lesson_id:
            errors['lesson_id'] = ['Lesson Assignment Name required.']

        if not title:
            errors['title'] = ['Title is required.']

        if not instructions:
            errors['instructions'] = ['Instruction is required.']

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_lesson_assignment = LessonAssignment.objects.create(
            lesson=lesson,
            title=title,
            instructions=instructions,
            code_template=code_template,
            expected_output=expected_output,
        )


        data['id'] = new_lesson_assignment.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_lesson_assignments_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lesson_assignments, excluding archived ones
    all_lesson_assignments = LessonAssignment.objects.filter(is_archived=False)


    # If a search query is provided, filter by lesson_assignment name
    if search_query:
        all_lesson_assignments = all_lesson_assignments.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_lesson_assignments, page_size)

    try:
        paginated_lesson_assignments = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_assignments = paginator.page(1)
    except EmptyPage:
        paginated_lesson_assignments = paginator.page(paginator.num_pages)

    # Serialize the paginated lesson_assignments
    all_lesson_assignments_serializer = AllLessonAssignmentsSerializer(paginated_lesson_assignments, many=True)

    # Prepare the response data
    data['assignments'] = all_lesson_assignments_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_assignments.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_assignments.next_page_number() if paginated_lesson_assignments.has_next() else None,
        'previous': paginated_lesson_assignments.previous_page_number() if paginated_lesson_assignments.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_lesson_assignment_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["Lesson  Assignment id required"]

    try:
        lesson_assignment = LessonAssignment.objects.get(id=id)
    except:
        errors['id'] = ['Lesson  Assignment does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson_assignment_serializer = LessonAssignmentDetailsSerializer(lesson_assignment, many=False)
    if lesson_assignment_serializer:
        lesson_assignment = lesson_assignment_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson_assignment

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def edit_lesson_assignment(request):
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
            lesson_assignment = LessonAssignment.objects.get(id=id)
        except:
            errors['id'] = ['LessonAssignment does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            lesson_assignment.name = name
        if description:
            lesson_assignment.description = description
        if photo:
            lesson_assignment.photo = photo

        lesson_assignment.save()

        data["name"] = lesson_assignment.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def archive_lesson_assignment(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonAssignment ID is required.']

        try:
            lesson_assignment = LessonAssignment.objects.get(id=id)
        except:
            errors['id'] = ['LessonAssignment does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_assignment.is_archived = True
        lesson_assignment.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def unarchive_lesson_assignment(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonAssignment ID is required.']

        try:
            lesson_assignment = LessonAssignment.objects.get(id=id)
        except:
            errors['id'] = ['LessonAssignment does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_assignment.is_archived = False
        lesson_assignment.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_all_archived_lesson_assignment_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lesson_assignments = LessonAssignment.objects.all().filter(is_archived=True)


    if search_query:
        all_lesson_assignments = all_lesson_assignments.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_lesson_assignments, page_size)

    try:
        paginated_lesson_assignments = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_assignments = paginator.page(1)
    except EmptyPage:
        paginated_lesson_assignments = paginator.page(paginator.num_pages)

    all_lesson_assignments_serializer = AllLessonAssignmentsSerializer(paginated_lesson_assignments, many=True)


    data['assignments'] = all_lesson_assignments_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_assignments.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_assignments.next_page_number() if paginated_lesson_assignments.has_next() else None,
        'previous': paginated_lesson_assignments.previous_page_number() if paginated_lesson_assignments.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_lesson_assignment(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson  Assignment ID is required.']

        try:
            lesson_assignment = LessonAssignment.objects.get(id=id)
        except:
            errors['id'] = ['Lesson  Assignment does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_assignment.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




