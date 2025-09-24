from __future__ import annotations

from typing import Any, Dict, List

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from students.api.serializers import StudentProjectDetailSerializer, StudentProjectSerializer
from students.api.views import StudentExperienceBaseView
from students.models import StudentProject
from students.services.coding import CodeExecutionError, normalise_execution_files
from students.services.projects import ensure_default_project_files, validate_project_files


class StudentProjectListCreateView(StudentExperienceBaseView):
    def get(self, request):
        student = self.get_student(request)
        projects = StudentProject.objects.filter(student=student)
        serializer = StudentProjectSerializer(projects, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        student = self.get_student(request)
        title = request.data.get("title")
        description = request.data.get("description", "")
        files = request.data.get("files")
        schema = request.data.get("validation_schema")

        if not isinstance(title, str) or not title.strip():
            return Response({"detail": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            initial_files = ensure_default_project_files(files)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        if schema is not None and not isinstance(schema, dict):
            return Response({"detail": "validation_schema must be an object."}, status=status.HTTP_400_BAD_REQUEST)

        project = StudentProject.objects.create(
            student=student,
            title=title.strip(),
            description=description or "",
            files=initial_files,
            validation_schema=schema or {},
        )

        serializer = StudentProjectDetailSerializer(project)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


class StudentProjectDetailView(StudentExperienceBaseView):
    def get(self, request, project_id: str):
        project = self._get_project(request, project_id)
        serializer = StudentProjectDetailSerializer(project)
        return Response({"data": serializer.data})

    def patch(self, request, project_id: str):
        project = self._get_project(request, project_id)
        updates: Dict[str, Any] = {}

        title = request.data.get("title")
        if title is not None:
            if not isinstance(title, str) or not title.strip():
                return Response({"detail": "Title must be a non-empty string."}, status=status.HTTP_400_BAD_REQUEST)
            updates["title"] = title.strip()

        description = request.data.get("description")
        if description is not None:
            if not isinstance(description, str):
                return Response({"detail": "Description must be a string."}, status=status.HTTP_400_BAD_REQUEST)
            updates["description"] = description

        if "files" in request.data:
            try:
                updates["files"] = normalise_execution_files(request.data.get("files", []))
            except CodeExecutionError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        if "validation_schema" in request.data:
            schema = request.data.get("validation_schema")
            if schema is not None and not isinstance(schema, dict):
                return Response({"detail": "validation_schema must be an object."}, status=status.HTTP_400_BAD_REQUEST)
            updates["validation_schema"] = schema or {}

        if updates:
            for field, value in updates.items():
                setattr(project, field, value)
            project.save(update_fields=list(updates.keys()) + ["updated_at"])

        serializer = StudentProjectDetailSerializer(project)
        return Response({"data": serializer.data})

    def delete(self, request, project_id: str):
        project = self._get_project(request, project_id)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _get_project(self, request, project_id: str) -> StudentProject:
        student = self.get_student(request)
        return get_object_or_404(StudentProject, student=student, project_id=project_id)


class StudentProjectPublishView(StudentExperienceBaseView):
    def post(self, request, project_id: str):
        project = self._get_project(request, project_id)
        publish = request.data.get("publish", True)
        project.is_published = bool(publish)
        project.save(update_fields=["is_published", "updated_at"])
        serializer = StudentProjectSerializer(project)
        return Response({"data": serializer.data})

    def _get_project(self, request, project_id: str) -> StudentProject:
        student = self.get_student(request)
        return get_object_or_404(StudentProject, student=student, project_id=project_id)


class StudentProjectValidateView(StudentExperienceBaseView):
    def post(self, request, project_id: str):
        project = self._get_project(request, project_id)
        files = request.data.get("files") or project.files
        schema = request.data.get("validation_schema") or project.validation_schema

        try:
            files_payload = normalise_execution_files(files)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            passed, details = validate_project_files(files_payload, schema)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        project.files = files_payload
        project.last_validation_result = {"passed": passed, "details": details}
        project.last_validated_at = timezone.now()
        project.save(update_fields=["files", "last_validation_result", "last_validated_at", "updated_at"])

        return Response({"data": project.last_validation_result})

    def _get_project(self, request, project_id: str) -> StudentProject:
        student = self.get_student(request)
        return get_object_or_404(StudentProject, student=student, project_id=project_id)
