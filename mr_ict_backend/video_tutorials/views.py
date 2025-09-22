from rest_framework.response import Response
from rest_framework import status
import ffmpeg
import os
import tempfile
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files import File

from video_tutorials.models import CodeSnapshotRecording, Recording
from rest_framework.decorators import api_view

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.contrib.auth import get_user_model

from django.conf import settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from video_tutorials.serializers import AllRecordingsSerializer, CodeSnapshotRecordingSerializer, RecordingSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, ProjectFile
from .serializers import ProjectSerializer, ProjectFileSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_video_view(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        user = getattr(request, 'user', None)
        if not user or not user.is_staff:
            return Response({"message": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        title = request.data.get('title', "")
        description = request.data.get('description', "")
        video_file = request.FILES.get('video_file')
        duration = request.data.get('duration', "")

        # Validate input
        if not title:
            errors['title'] = ['Title is required.']

        if not video_file:
            errors['video_file'] = ['Video is required.']

        if not duration:
            errors['duration'] = ['Duration is required.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure unique title
            original_title = title
            counter = 1
            while Recording.objects.filter(title=title).exists():
                title = f"{original_title}_{counter}"
                counter += 1

            saved_file_name = None

            # Try to convert to mp4 if ffmpeg available; else store original
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.tmp') as tmp_file:
                    for chunk in video_file.chunks():
                        tmp_file.write(chunk)
                    tmp_file_path = tmp_file.name

                # Convert using ffmpeg into memory and save to storage
                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as out_file:
                    output_path = out_file.name

                ffmpeg.input(tmp_file_path).output(output_path, format='mp4', vcodec='libx264', acodec='aac').run()

                with open(output_path, 'rb') as f:
                    mp4_video = ContentFile(f.read(), name=f'{title}.mp4')
                    saved_file_name = default_storage.save(f'recordings/{title}.mp4', mp4_video)

                # Clean temp files
                try:
                    os.remove(tmp_file_path)
                except Exception:
                    pass
                try:
                    os.remove(output_path)
                except Exception:
                    pass
            except Exception:
                # Fallback: save the original uploaded file under recordings/
                saved_file_name = default_storage.save(f'recordings/{video_file.name}', video_file)

            # Create the new video record in the database
            new_video = Recording.objects.create(
                title=title,
                description=description,
                video_file=saved_file_name,
                duration=duration,
            )

            # Set code snippet IDs
            # Use a batch update with `update()` to set the `recording` field for all matching records
            CodeSnapshotRecording.objects.filter(title=original_title).update(recording=new_video)

            data['video_id'] = new_video.id

            payload['message'] = "Successful"
            payload['data'] = data

        except Exception as e:
            payload['message'] = "Error during video conversion"
            payload['errors'] = str(e)
            return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(payload)

@api_view(['POST'])
def save_code_snapshot_orijay(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        title = request.data.get('title', "")
        code_content = request.data.get('code', "")
        cursor_position = request.data.get('cursorPosition', "")
        scroll_position = request.data.get('scrollPosition', "")
        timestamp = request.data.get('timestamp', "")

        # Validate input
        if not code_content:
            errors['code_content'] = ['Code content is required.']


        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)


        new_snippet = CodeSnapshotRecording.objects.create(
            title=title,
            code_content=code_content,
            cursor_position=cursor_position,
            scroll_position=scroll_position,
            timestamp=timestamp

        )

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_code_snapshot(request):
    """
    API endpoint to save batches of code snapshots
    """
    payload = {
        'message': '',
        'data': {},
        'errors': {},
        'success_count': 0,
        'error_count': 0
    }

    if request.method == 'POST':
        user = getattr(request, 'user', None)
        if not user or not user.is_staff:
            return Response({"message": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        snapshots = request.data.get('snapshots', [])
        title = request.data.get('title', '')
        
        if not title:
            payload['errors']['title'] = ['Title is required.']
            payload['message'] = "Error: Missing title"
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        if not snapshots:
            payload['errors']['snapshots'] = ['No snapshots provided.']
            payload['message'] = "Error: No snapshots"
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)
        
        # Use bulk_create for better performance with multiple snapshots
        snapshots_to_create = []
        
        for index, snapshot in enumerate(snapshots):
            try:
                code_content = snapshot.get('code', "")
                cursor_position = snapshot.get('cursorPosition', {})
                scroll_position = snapshot.get('scrollPosition', {})
                timestamp = snapshot.get('timestamp', 0)
                
                if not code_content:
                    payload['error_count'] += 1
                    payload['errors'][f'snapshot_{index}'] = 'Code content is empty.'
                    continue
                
                # Prepare object for bulk creation
                snapshots_to_create.append(
                    CodeSnapshotRecording(
                        title=title,
                        code_content=code_content,
                        cursor_position=cursor_position,
                        scroll_position=scroll_position,
                        timestamp=timestamp
                    )
                )
                payload['success_count'] += 1
                
            except Exception as e:
                payload['error_count'] += 1
                payload['errors'][f'snapshot_{index}'] = str(e)
        
        # Bulk create all valid snapshots at once (more efficient)
        if snapshots_to_create:
            try:
                CodeSnapshotRecording.objects.bulk_create(snapshots_to_create)
                payload['message'] = f"Successfully saved {len(snapshots_to_create)} snapshots"
                payload['data']['saved_count'] = len(snapshots_to_create)
            except Exception as e:
                payload['message'] = f"Error during bulk save: {str(e)}"
                payload['errors']['bulk_save'] = str(e)
                return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            payload['message'] = "No valid snapshots to save"
            
    return Response(payload, status=status.HTTP_200_OK if payload['success_count'] > 0 else status.HTTP_400_BAD_REQUEST)


# Admin publish endpoint
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_recording_view(request, recording_id: int):
    try:
        rec = Recording.objects.get(id=recording_id)
    except Recording.DoesNotExist:
        return Response({"message": "Recording not found"}, status=status.HTTP_404_NOT_FOUND)

    # Simple admin check; refine with roles/permissions as needed
    user = getattr(request, 'user', None)
    if not user or not user.is_staff:
        return Response({"message": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    rec.published = True
    rec.save(update_fields=["published"])
    return Response({"message": "Published", "data": {"id": rec.id, "published": rec.published}})


# Student: list recordings (published by default)
@api_view(['GET'])
def list_recordings_view(request):
    qs = Recording.objects.all()
    # If not staff or no ?all=1, filter to published only
    all_flag = request.query_params.get('all') == '1'
    if not (getattr(request, 'user', None) and request.user.is_staff and all_flag):
        qs = qs.filter(published=True)

    data = AllRecordingsSerializer(qs.order_by('-created_at'), many=True).data
    return Response({"message": "Successful", "data": data})


# Student: recording details with ordered code snapshots
@api_view(['GET'])
def recording_detail_view(request, recording_id: int):
    try:
        rec = Recording.objects.get(id=recording_id)
    except Recording.DoesNotExist:
        return Response({"message": "Recording not found"}, status=status.HTTP_404_NOT_FOUND)

    # Enforce published unless staff
    if not rec.published and not (getattr(request, 'user', None) and request.user.is_staff):
        return Response({"message": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    snippets = CodeSnapshotRecording.objects.filter(recording=rec).order_by('timestamp')
    snippets_data = CodeSnapshotRecordingSerializer(snippets, many=True).data

    # Build absolute or relative URL as provided by storage
    video_url = getattr(rec.video_file, 'url', None) or str(rec.video_file)

    return Response({
        "message": "Successful",
        "data": {
            "id": rec.id,
            "title": rec.title,
            "description": rec.description,
            "duration": rec.duration,
            "published": rec.published,
            "video_url": video_url,
            "code_snippets": snippets_data,
        }
    })




@api_view(['GET', ])
def get_video_tutorial_details_view(request):
    payload = {}
    data = {}
    errors = {}

    video_id = request.query_params.get('video_id', None)

    #if not video_id:
    #    errors['video_id'] = ["Video id required"]

    #try:
    #    _video = Recording.objects.get(video_id=video_id)
    #except Recording.DoesNotExist:
    #    errors['video_id'] = ['Recording does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    _video = Recording.objects.order_by('-id').first()



    data['video_url'] = _video.video_file.url


    code_snippets = CodeSnapshotRecording.objects.filter(recording=_video)
    code_snippets_serializer = CodeSnapshotRecordingSerializer(code_snippets, many=True)
    code_snippets = code_snippets_serializer.data if code_snippets_serializer else []

    data['code_snippets'] = code_snippets


    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#@authentication_classes([TokenAuthentication])
def get_all_recorded_turorial_view(request):
    payload = {}
    data = {}
    errors = {}

  
    search_query = request.query_params.get('search', '')
    page_number = request.query_params.get('page', 1)
    page_size = 100

    
    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    all_tutorials = Recording.objects.all().filter().order_by('-id')


    if search_query:
        all_tutorials = all_tutorials.filter(
            Q(title__icontains=search_query) 
        )


    paginator = Paginator(all_tutorials, page_size)

    try:
        paginated_tutorials = paginator.page(page_number)
    except PageNotAnInteger:
        paginated_tutorials = paginator.page(1)
    except EmptyPage:
        paginated_tutorials = paginator.page(paginator.num_pages)

    all_tutorials_serializer = AllRecordingsSerializer(paginated_tutorials, many=True)


    data['all_tutorials'] = all_tutorials_serializer.data

    data['pagination'] = {
        'page_number': paginated_tutorials.number,
        'count': all_tutorials.count(),
        'total_pages': paginator.num_pages,
        'next': paginated_tutorials.next_page_number() if paginated_tutorials.has_next() else None,
        'previous': paginated_tutorials.previous_page_number() if paginated_tutorials.has_previous() else None,
    }

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)





def cut_video_and_code(request):
    data = json.loads(request.body)
    video_id = data['videoId']
    start_time = data['start']
    end_time = data['end']

    # Step 1: Cut the video (you can use a library like moviepy or ffmpeg)
    # This utility function will handle video cutting and save the new video file
    cut_video(video_id, start_time, end_time)

    # Step 2: Remove code snapshots in the cut range
    CodeSnapshotRecording.objects.filter(
        timestamp__gte=start_time,
        timestamp__lte=end_time,
        video_id=video_id
    ).delete()  # This will delete all code snapshots that fall within the cut range

    # Step 3: Adjust the timestamps of the remaining code snapshots that are after the cut range
    CodeSnapshotRecording.objects.filter(
        timestamp__gt=end_time,
        video_id=video_id
    ).update(
        timestamp=F('timestamp') - (end_time - start_time)  # Adjust the timestamps
    )

    # Step 4: Optionally return the updated list of code snapshots
    remaining_snippets = CodeSnapshotRecording.objects.filter(video_id=video_id).values('id', 'timestamp', 'code_content', 'cursor_position', 'scroll_position')
    
    return JsonResponse({'updatedSnippets': list(remaining_snippets)})










#from moviepy.editor import VideoFileClip

def cut_video(video_id, start_time, end_time):
    video_path = f'/path/to/videos/{video_id}.mp4'
    output_path = f'/path/to/output/{video_id}_cut.mp4'
    
    video_clip = VideoFileClip(video_path)
    cut_clip = video_clip.subclip(start_time, end_time)
    cut_clip.write_videofile(output_path)
    
    # Optionally, update your video file path in the database if you want to store it
    # Video.objects.filter(id=video_id).update(video_file=output_path)






########################################
############################################
############################################
#### Project


# List Projects
@api_view(['GET'])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

# Create a new Project
@api_view(['POST'])
def project_create(request):
    if request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()

            # Create default files for new project
            ProjectFile.objects.create(
                project=project,
                file_type='html',
                name='index.html',
                content='<!DOCTYPE html>\n<html>\n<head>\n  <title>New Project</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="scripts.js"></script>\n</body>\n</html>'
            )
            ProjectFile.objects.create(
                project=project,
                file_type='css',
                name='styles.css',
                content='body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}'
            )
            ProjectFile.objects.create(
                project=project,
                file_type='js',
                name='scripts.js',
                content='console.log("Script loaded!");\n'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve single Project
@api_view(['GET'])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    serializer_class = ProjectFileSerializer
    
    def get_queryset(self):
        return ProjectFile.objects.all()
    
    @action(detail=False, methods=['get'])
    def by_project(self, request):
        project_id = request.query_params.get('project')
        if project_id:
            files = ProjectFile.objects.filter(project_id=project_id)
            serializer = self.get_serializer(files, many=True)
            return Response(serializer.data)
        return Response({"error": "Project ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    













# List Project Files
@api_view(['GET'])
def project_file_list(request):
    if request.method == 'GET':
        files = ProjectFile.objects.all()
        serializer = ProjectFileSerializer(files, many=True)
        return Response(serializer.data)

# Retrieve Project Files by Project ID
@api_view(['GET'])
def project_file_by_project(request):
    project_id = request.query_params.get('project')
    if project_id:
        files = ProjectFile.objects.filter(project_id=project_id)
        serializer = ProjectFileSerializer(files, many=True)
        return Response(serializer.data)
    return Response({"error": "Project ID is required"}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['PATCH'])
def update_project_file(request, file_id):
    try:
        # Fetch the ProjectFile by file_id
        project_file = ProjectFile.objects.get(id=file_id)
    except ProjectFile.DoesNotExist:
        return Response({"error": "Project file not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the request contains the new content for the file
    if 'content' not in request.data:
        return Response({"error": "Content is required to update the file."}, status=status.HTTP_400_BAD_REQUEST)

    # Update the content
    project_file.content = request.data['content']
    project_file.save()

    # Serialize the updated file object and return the response
    serializer = ProjectFileSerializer(project_file)
    return Response(serializer.data, status=status.HTTP_200_OK)
