"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static

from video_tutorials.views import get_all_recorded_turorial_view, get_video_tutorial_details_view, project_create, project_detail, project_file_by_project, project_file_list, project_list, record_video_view, save_code_snapshot, update_project_file
from core.health import health_check_view


urlpatterns = [
    path("admin/", admin.site.urls),

    path('api/homepage/', include('homepage.urls', 'homepage_api')),

    path('api/accounts/', include('accounts.api.urls', 'accounts_api')),
    path('api/schools/', include('schools.urls', 'schools_api')),
    path('api/courses/', include('courses.urls', 'courses_api')),
    path('api/admin/content/', include('courses.api.urls', 'courses_admin_api')),
    path('api/students/', include('students.urls', 'students_api')),
    path('api/assessments/', include('assessments.api.urls', 'assessments_api')),
    path('api/notifications/', include('notifications.api.urls', 'notifications_api')),
    path('api/analytics/', include('analytics.api.urls', 'analytics_api')),

    #path("api/upload/", VideoUploadView.as_view(), name="video-upload"),
    path("api/upload/", record_video_view, name="video-upload"),

    path("api/save-code-snapshots/", save_code_snapshot, name="save_code_snapshot"),

    path("api/all-recorded-videos/", get_all_recorded_turorial_view, name="all_recorded"),
    path("api/tutorial/", get_video_tutorial_details_view, name="video_code"),

    ############
    path('api/projects/', project_list, name='project_list'),
    path('api/projects/create/', project_create, name='project_create'),
    path('api/projects/<int:pk>/', project_detail, name='project_detail'),
    path('api/project_files/', project_file_list, name='project_file_list'),
    path('api/project_files/by_project/', project_file_by_project, name='project_file_by_project'),
    path('api/project_files/<int:file_id>/', update_project_file, name='update_project_file'),


    path("health/", health_check_view, name="health-check"),
]


try:
    urlpatterns.append(path('api/llm-tutor/', include('llm_tutor.urls', 'llm_tutor_api')))
except ModuleNotFoundError:
    # LLM tutor dependencies are optional until Phase 4 resumes.
    pass


if settings.DEBUG:
    urlpatterns = urlpatterns + static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
