from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import ChallengeBadge, Lesson
from courses.views.serializers import AllChallengeBadgesSerializer, ChallengeBadgeDetailsSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_lesson_badge_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        badge_name = request.data.get('badge_name', "")
        image = request.data.get('image', "")
        criteria = request.data.get('criteria', "")

        # Validate input
        if not badge_name:
            errors['badge_name'] = ['Badge Name required.']

        if not image:
            errors['image'] = ['Image file is required.']

        if not criteria:
            errors['criteria'] = ['Crateria file is required.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_lesson_badge = ChallengeBadge.objects.create(
            badge_name=badge_name,
            image=image,
            criteria=criteria,
     
        )


        data['id'] = new_lesson_badge.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_all_lesson_badges_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lesson_badges, excluding archived ones
    all_lesson_badges = ChallengeBadge.objects.filter(is_archived=False)


    # If a search query is provided, filter by lesson_badge name
    if search_query:
        all_lesson_badges = all_lesson_badges.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_lesson_badges, page_size)

    try:
        paginated_lesson_badges = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_badges = paginator.page(1)
    except EmptyPage:
        paginated_lesson_badges = paginator.page(paginator.num_pages)

    # Serialize the paginated lesson_badges
    all_lesson_badges_serializer = AllChallengeBadgesSerializer(paginated_lesson_badges, many=True)

    # Prepare the response data
    data['badges'] = all_lesson_badges_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_badges.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_badges.next_page_number() if paginated_lesson_badges.has_next() else None,
        'previous': paginated_lesson_badges.previous_page_number() if paginated_lesson_badges.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_lesson_badge_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["Lesson  Badge id required"]

    try:
        lesson_badge = ChallengeBadge.objects.get(id=id)
    except:
        errors['id'] = ['Lesson  Badge does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson_badge_serializer = ChallengeBadgeDetailsSerializer(lesson_badge, many=False)
    if lesson_badge_serializer:
        lesson_badge = lesson_badge_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson_badge

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def edit_lesson_badge(request):
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
            lesson_badge = ChallengeBadge.objects.get(id=id)
        except:
            errors['id'] = ['ChallengeBadge does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            lesson_badge.name = name
        if description:
            lesson_badge.description = description
        if photo:
            lesson_badge.photo = photo

        lesson_badge.save()

        data["name"] = lesson_badge.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def archive_lesson_badge(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['ChallengeBadge ID is required.']

        try:
            lesson_badge = ChallengeBadge.objects.get(id=id)
        except:
            errors['id'] = ['ChallengeBadge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_badge.is_archived = True
        lesson_badge.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def unarchive_lesson_badge(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['ChallengeBadge ID is required.']

        try:
            lesson_badge = ChallengeBadge.objects.get(id=id)
        except:
            errors['id'] = ['ChallengeBadge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_badge.is_archived = False
        lesson_badge.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_all_archived_lesson_badge_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lesson_badges = ChallengeBadge.objects.all().filter(is_archived=True)


    if search_query:
        all_lesson_badges = all_lesson_badges.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_lesson_badges, page_size)

    try:
        paginated_lesson_badges = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_badges = paginator.page(1)
    except EmptyPage:
        paginated_lesson_badges = paginator.page(paginator.num_pages)

    all_lesson_badges_serializer = AllChallengeBadgesSerializer(paginated_lesson_badges, many=True)


    data['badges'] = all_lesson_badges_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_badges.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_badges.next_page_number() if paginated_lesson_badges.has_next() else None,
        'previous': paginated_lesson_badges.previous_page_number() if paginated_lesson_badges.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def delete_lesson_badge(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson  Badge ID is required.']

        try:
            lesson_badge = ChallengeBadge.objects.get(id=id)
        except:
            errors['id'] = ['Lesson  Badge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_badge.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




