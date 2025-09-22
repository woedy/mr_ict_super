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
from courses.views.serializers import AllCoursesSerializer, CourseDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_course_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        title = request.data.get('title', "")
        description = request.data.get('description', "")
        image = request.data.get('image', "")

        # Validate input
        if not title:
            errors['title'] = ['Course title required.']

        if not description:
            errors['description'] = ['Contact description is required.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_course = Course.objects.create(
            title=title,
            description=description,
            image=image,
        )


        data['course_id'] = new_course.course_id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_courses_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all courses, excluding archived ones
    all_courses = Course.objects.filter(is_archived=False)


    # If a search query is provided, filter by course name
    if search_query:
        all_courses = all_courses.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_courses, page_size)

    try:
        paginated_courses = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_courses = paginator.page(1)
    except EmptyPage:
        paginated_courses = paginator.page(paginator.num_pages)

    # Serialize the paginated courses
    all_courses_serializer = AllCoursesSerializer(paginated_courses, many=True)

    # Prepare the response data
    data['courses'] = all_courses_serializer.data
    data['pagination'] = {
        'page_number': paginated_courses.number,
        'total_pages': paginator.num_pages,
        'next': paginated_courses.next_page_number() if paginated_courses.has_next() else None,
        'previous': paginated_courses.previous_page_number() if paginated_courses.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_course_details_view(request):
    payload = {}
    data = {}
    errors = {}

    course_id = request.query_params.get('course_id', None)

    if not course_id:
        errors['course_id'] = ["Course id required"]

    try:
        course = Course.objects.get(course_id=course_id)
    except Course.DoesNotExist:
        errors['course_id'] = ['Course does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    course_serializer = CourseDetailsSerializer(course, many=False)
    if course_serializer:
        course = course_serializer.data


    payload['message'] = "Successful"
    payload['data'] = course

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_course(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        course_id = request.data.get('course_id', "")
        title = request.data.get('title', "")
        description = request.data.get('description', "")
        image = request.data.get('image', "")

        # Validate input
        if not title:
            errors['title'] = ['Course title required.']

        if not description:
            errors['description'] = ['Contact description is required.']

        try:
            course = Course.objects.get(course_id=course_id)
        except:
            errors['course_id'] = ['Course does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if title:
            course.title = title
        if description:
            course.description = description
        if image:
            course.image = image

        course.save()

        data["name"] = course.title




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_course(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        course_id = request.data.get('course_id', "")

        if not course_id:
            errors['course_id'] = ['Course ID is required.']

        try:
            course = Course.objects.get(course_id=course_id)
        except:
            errors['course_id'] = ['Course does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        course.is_archived = True
        course.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_course(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        course_id = request.data.get('course_id', "")

        if not course_id:
            errors['course_id'] = ['Course ID is required.']

        try:
            course = Course.objects.get(course_id=course_id)
        except:
            errors['course_id'] = ['Course does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        course.is_archived = False
        course.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_courses_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_courses = Course.objects.all().filter(is_archived=True)


    if search_query:
        all_courses = all_courses.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_courses, page_size)

    try:
        paginated_courses = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_courses = paginator.page(1)
    except EmptyPage:
        paginated_courses = paginator.page(paginator.num_pages)

    all_courses_serializer = AllCoursesSerializer(paginated_courses, many=True)


    data['food_categories'] = all_courses_serializer.data
    data['pagination'] = {
        'page_number': paginated_courses.number,
        'total_pages': paginator.num_pages,
        'next': paginated_courses.next_page_number() if paginated_courses.has_next() else None,
        'previous': paginated_courses.previous_page_number() if paginated_courses.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_course(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        course_id = request.data.get('course_id', "")

        if not course_id:
            errors['course_id'] = ['Course ID is required.']

        try:
            course = Course.objects.get(course_id=course_id)
        except:
            errors['course_id'] = ['Course does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        course.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




