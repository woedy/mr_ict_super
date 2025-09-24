from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import (
    ContentAuditLogViewSet,
    CourseViewSet,
    LessonVideoViewSet,
    LessonViewSet,
    ModuleViewSet,
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"modules", ModuleViewSet, basename="module")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"lesson-media", LessonVideoViewSet, basename="lesson-media")
router.register(r"audit-logs", ContentAuditLogViewSet, basename="audit-log")

app_name = "courses_admin"

urlpatterns = [
    path("", include(router.urls)),
]
