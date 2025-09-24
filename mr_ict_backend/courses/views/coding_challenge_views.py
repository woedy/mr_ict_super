from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import CodingChallenge, Course
from courses.views.serializers import AllCodingChallengesSerializer, CodingChallengeDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_coding_challenge_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        course_id = request.data.get('course_id', "")
        title = request.data.get('title', "")
        instructions = request.data.get('instructions', "")
        expected_output = request.data.get('expected_output', "")
        code_template = request.data.get('code_template', "")
        difficulty = request.data.get('difficulty', "")

        # Validate input
        if not title:
            errors['title'] = ['CodingChallenge title required.']


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

        
        new_coding_challenge = CodingChallenge.objects.create(
            course=course,
            title=title,
            instructions=instructions,
            expected_output=expected_output,
            code_template=code_template,
            difficulty=difficulty,
        )


        data['id'] = new_coding_challenge.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_coding_challenges_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all coding_challenges, excluding archived ones
    all_coding_challenges = CodingChallenge.objects.filter(is_archived=False)


    # If a search query is provided, filter by coding_challenge name
    if search_query:
        all_coding_challenges = all_coding_challenges.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_coding_challenges, page_size)

    try:
        paginated_coding_challenges = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_coding_challenges = paginator.page(1)
    except EmptyPage:
        paginated_coding_challenges = paginator.page(paginator.num_pages)

    # Serialize the paginated coding_challenges
    all_coding_challenges_serializer = AllCodingChallengesSerializer(paginated_coding_challenges, many=True)

    # Prepare the response data
    data['coding_challenges'] = all_coding_challenges_serializer.data
    data['pagination'] = {
        'page_number': paginated_coding_challenges.number,
        'total_pages': paginator.num_pages,
        'next': paginated_coding_challenges.next_page_number() if paginated_coding_challenges.has_next() else None,
        'previous': paginated_coding_challenges.previous_page_number() if paginated_coding_challenges.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_coding_challenge_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["CodingChallenge id required"]

    try:
        coding_challenge = CodingChallenge.objects.get(id=id)
    except CodingChallenge.DoesNotExist:
        errors['id'] = ['CodingChallenge does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    coding_challenge_serializer = CodingChallengeDetailsSerializer(coding_challenge, many=False)
    if coding_challenge_serializer:
        coding_challenge = coding_challenge_serializer.data


    payload['message'] = "Successful"
    payload['data'] = coding_challenge

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def edit_coding_challenge(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")
        title = request.data.get('title', "")
        description = request.data.get('description', "")
        image = request.data.get('image', "")

        # Validate input
        if not title:
            errors['title'] = ['CodingChallenge title required.']

        if not description:
            errors['description'] = ['Contact description is required.']

        try:
            coding_challenge = CodingChallenge.objects.get(id=id)
        except:
            errors['id'] = ['CodingChallenge does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if title:
            coding_challenge.title = title
        if description:
            coding_challenge.description = description
        if image:
            coding_challenge.image = image

        coding_challenge.save()

        data["name"] = coding_challenge.title




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def archive_coding_challenge(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['CodingChallenge ID is required.']

        try:
            coding_challenge = CodingChallenge.objects.get(id=id)
        except:
            errors['id'] = ['CodingChallenge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        coding_challenge.is_archived = True
        coding_challenge.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def unarchive_coding_challenge(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['CodingChallenge ID is required.']

        try:
            coding_challenge = CodingChallenge.objects.get(id=id)
        except:
            errors['id'] = ['CodingChallenge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        coding_challenge.is_archived = False
        coding_challenge.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_all_archived_coding_challenges_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_coding_challenges = CodingChallenge.objects.all().filter(is_archived=True)


    if search_query:
        all_coding_challenges = all_coding_challenges.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_coding_challenges, page_size)

    try:
        paginated_coding_challenges = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_coding_challenges = paginator.page(1)
    except EmptyPage:
        paginated_coding_challenges = paginator.page(paginator.num_pages)

    all_coding_challenges_serializer = AllCodingChallengesSerializer(paginated_coding_challenges, many=True)


    data['food_categories'] = all_coding_challenges_serializer.data
    data['pagination'] = {
        'page_number': paginated_coding_challenges.number,
        'total_pages': paginator.num_pages,
        'next': paginated_coding_challenges.next_page_number() if paginated_coding_challenges.has_next() else None,
        'previous': paginated_coding_challenges.previous_page_number() if paginated_coding_challenges.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_coding_challenge(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['CodingChallenge ID is required.']

        try:
            coding_challenge = CodingChallenge.objects.get(id=id)
        except:
            errors['id'] = ['CodingChallenge does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        coding_challenge.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




