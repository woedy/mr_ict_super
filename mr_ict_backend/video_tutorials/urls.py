from django.urls import path
from . import views

urlpatterns = [
    # Admin recording endpoints
    path('api/upload/', views.record_video_view, name='video-upload'),
    path('api/save-code-snapshots/', views.save_code_snapshot, name='save-code-snapshots'),
    path('api/recordings/<int:recording_id>/publish/', views.publish_recording_view, name='publish-recording'),

    # Student playback endpoints
    path('api/recordings/', views.list_recordings_view, name='list-recordings'),
    path('api/recordings/<int:recording_id>/', views.recording_detail_view, name='recording-detail'),
]
