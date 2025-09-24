from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response

from courses.models import Lesson, LessonIntroVideo
from courses.views.serializers import AllLessonIntroVideosSerializer, LessonIntroVideoDetailsSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_lesson_intro_video_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        lesson_id = request.data.get('lesson_id', "")
        video_file = request.data.get('video_file', "")

        # Validate input
        if not lesson_id:
            errors['lesson_id'] = ['Lesson Video Name required.']

        if not video_file:
            errors['video_file'] = ['Video file is required.']

        try:
            lesson = Lesson.objects.get(lesson_id=lesson_id)
        except:
            errors['lesson_id'] = ['Lesson does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        
        new_lesson_intro_video = LessonIntroVideo.objects.create(
            lesson=lesson,
            video_file=video_file,
     
        )


        data['id'] = new_lesson_intro_video.id
        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_all_lesson_intro_videos_view(request):
    payload = {}
    data = {}
    errors = {}

    # Get query parameters
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    # Start with all lesson_videos, excluding archived ones
    all_lesson_videos = LessonIntroVideo.objects.filter(is_archived=False)


    # If a search query is provided, filter by lesson_video name
    if search_query:
        all_lesson_videos = all_lesson_videos.filter(Q(name__icontains=search_query)).distinct()


    # Paginate the result
    paginator = Paginator(all_lesson_videos, page_size)

    try:
        paginated_lesson_videos = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_videos = paginator.page(1)
    except EmptyPage:
        paginated_lesson_videos = paginator.page(paginator.num_pages)

    # Serialize the paginated lesson_videos
    all_lesson_videos_serializer = AllLessonIntroVideosSerializer(paginated_lesson_videos, many=True)

    # Prepare the response data
    data['intro_videos'] = all_lesson_videos_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_videos.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_videos.next_page_number() if paginated_lesson_videos.has_next() else None,
        'previous': paginated_lesson_videos.previous_page_number() if paginated_lesson_videos.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_lesson_intro_video_details_view(request):
    payload = {}
    data = {}
    errors = {}

    id = request.query_params.get('id', None)

    if not id:
        errors['id'] = ["Lesson Intro Video id required"]

    try:
        lesson_video = LessonIntroVideo.objects.get(id=id)
    except:
        errors['id'] = ['Lesson Intro Video does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    lesson_video_serializer = LessonIntroVideoDetailsSerializer(lesson_video, many=False)
    if lesson_video_serializer:
        lesson_video = lesson_video_serializer.data


    payload['message'] = "Successful"
    payload['data'] = lesson_video

    return Response(payload, status=status.HTTP_200_OK)





@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def edit_lesson_video(request):
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
            lesson_video = LessonVideo.objects.get(id=id)
        except:
            errors['id'] = ['LessonVideo does not exist.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        # Update fields only if provided and not empty
        if name:
            lesson_video.name = name
        if description:
            lesson_video.description = description
        if photo:
            lesson_video.photo = photo

        lesson_video.save()

        data["name"] = lesson_video.name




        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)


@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def archive_lesson_intro_video(request):
    payload = {}
    data = {}
    errors = {}

    total_value = 0.0
    
    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonVideo ID is required.']

        try:
            lesson_video = LessonIntroVideo.objects.get(id=id)
        except:
            errors['id'] = ['LessonVideo does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_video.is_archived = True
        lesson_video.save()

   

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def unarchive_lesson_intro_video(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['LessonVideo ID is required.']

        try:
            lesson_video = LessonIntroVideo.objects.get(id=id)
        except:
            errors['id'] = ['LessonVideo does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_video.is_archived = False
        lesson_video.save()



        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_all_archived_lesson_intro_video_view(request):
    payload = {}
    data = {}
    errors = {}

    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 10

    all_lesson_videos = LessonIntroVideo.objects.all().filter(is_archived=True)


    if search_query:
        all_lesson_videos = all_lesson_videos.filter(
            Q(name__icontains=search_query) 
        
        )


    paginator = Paginator(all_lesson_videos, page_size)

    try:
        paginated_lesson_videos = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_lesson_videos = paginator.page(1)
    except EmptyPage:
        paginated_lesson_videos = paginator.page(paginator.num_pages)

    all_lesson_videos_serializer = AllLessonIntroVideosSerializer(paginated_lesson_videos, many=True)


    data['intro_videos'] = all_lesson_videos_serializer.data
    data['pagination'] = {
        'page_number': paginated_lesson_videos.number,
        'total_pages': paginator.num_pages,
        'next': paginated_lesson_videos.next_page_number() if paginated_lesson_videos.has_next() else None,
        'previous': paginated_lesson_videos.previous_page_number() if paginated_lesson_videos.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def delete_lesson_intro_video(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        id = request.data.get('id', "")

        if not id:
            errors['id'] = ['Lesson Intro Video ID is required.']

        try:
            lesson_video = LessonIntroVideo.objects.get(id=id)
        except:
            errors['id'] = ['Lesson intro Video does not exist.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        lesson_video.delete()


        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)




