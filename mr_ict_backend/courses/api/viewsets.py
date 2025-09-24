from __future__ import annotations

from typing import Iterable

from django.db.models import Prefetch, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from courses.models import ContentAuditLog, Course, Lesson, LessonVideo, Module, PublishStatus
from courses.services import (
    validate_course_publishable,
    validate_lesson_publishable,
    validate_module_publishable,
)

from .serializers import (
    ContentAuditLogSerializer,
    CourseSerializer,
    LessonSerializer,
    LessonVideoSerializer,
    ModuleSerializer,
    StatusNotesSerializer,
)


class AdminCourseBaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def _filter_queryset_by_status(self, queryset, statuses: Iterable[str]):
        valid_statuses = {choice for choice, _ in PublishStatus.choices}
        filtered = [status for status in statuses if status in valid_statuses]
        if filtered:
            queryset = queryset.filter(status__in=filtered)
        return queryset

    def _apply_common_filters(self, queryset):
        request = self.request
        status_param = request.query_params.get("status")
        if status_param:
            queryset = self._filter_queryset_by_status(queryset, status_param.split(","))

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(summary__icontains=search)
            )
        return queryset


class CourseViewSet(AdminCourseBaseViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.prefetch_related(
            Prefetch(
                "modules",
                queryset=Module.objects.prefetch_related(
                    Prefetch(
                        "lessons",
                        queryset=Lesson.objects.prefetch_related("videos").order_by("order"),
                    )
                ).order_by("order"),
            )
        ).order_by("title")
        return self._apply_common_filters(queryset)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="submit-for-review")
    def submit_for_review(self, request, pk=None):
        course = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course.mark_in_review(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(course).data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        course = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validate_course_publishable(course)
        course.mark_published(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(course).data)

    @action(detail=True, methods=["post"], url_path="revert")
    def revert_to_draft(self, request, pk=None):
        course = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course.mark_draft(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(course).data)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        course = self.get_object()
        logs = ContentAuditLog.objects.filter(
            content_type__model="course",
            object_id=course.pk,
        )
        serializer = ContentAuditLogSerializer(logs, many=True)
        return Response(serializer.data)


class ModuleViewSet(AdminCourseBaseViewSet):
    serializer_class = ModuleSerializer

    def get_queryset(self):
        queryset = Module.objects.select_related("course").prefetch_related(
            Prefetch(
                "lessons",
                queryset=Lesson.objects.prefetch_related("videos").order_by("order"),
            )
        ).order_by("course__title", "order")

        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return self._apply_common_filters(queryset)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="submit-for-review")
    def submit_for_review(self, request, pk=None):
        module = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        module.mark_in_review(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(module).data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        module = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validate_module_publishable(module)
        module.mark_published(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(module).data)

    @action(detail=True, methods=["post"], url_path="revert")
    def revert_to_draft(self, request, pk=None):
        module = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        module.mark_draft(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(module).data)


class LessonViewSet(AdminCourseBaseViewSet):
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = Lesson.objects.select_related("module", "course").prefetch_related("videos").order_by("order")
        module_id = self.request.query_params.get("module")
        if module_id:
            queryset = queryset.filter(module_id=module_id)
        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return self._apply_common_filters(queryset)

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"], url_path="submit-for-review")
    def submit_for_review(self, request, pk=None):
        lesson = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lesson.mark_in_review(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(lesson).data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        lesson = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validate_lesson_publishable(lesson)
        lesson.mark_published(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(lesson).data)

    @action(detail=True, methods=["post"], url_path="revert")
    def revert_to_draft(self, request, pk=None):
        lesson = self.get_object()
        serializer = StatusNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lesson.mark_draft(performed_by=request.user, notes=serializer.validated_data.get("notes"))
        return Response(self.get_serializer(lesson).data)


class LessonVideoViewSet(AdminCourseBaseViewSet):
    serializer_class = LessonVideoSerializer
    queryset = LessonVideo.objects.select_related("lesson", "lesson__module")

    def perform_create(self, serializer):
        serializer.save()


class ContentAuditLogViewSet(AdminCourseBaseViewSet):
    serializer_class = ContentAuditLogSerializer
    queryset = ContentAuditLog.objects.select_related("performed_by", "content_type")

    http_method_names = ["get", "head", "options"]

