from __future__ import annotations

from typing import Any, Dict, List

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from courses.models import CodingChallenge
from students.api.serializers import (
    CodingChallengeDetailSerializer,
    CodingChallengeListSerializer,
)
from students.api.views import StudentExperienceBaseView
from students.models import StudentCodingChallengeState
from students.services.coding import (
    CodeExecutionError,
    normalise_execution_files,
    run_python_files,
    run_test_cases,
)

HINT_COOLDOWN_SECONDS = 45


def _ensure_state(student, challenge: CodingChallenge) -> StudentCodingChallengeState:
    try:
        starter_files = normalise_execution_files(challenge.starter_files or [])
    except CodeExecutionError as exc:
        raise CodeExecutionError(
            "Coding challenge starter files are misconfigured."
        ) from exc

    state, created = StudentCodingChallengeState.objects.get_or_create(
        student=student,
        challenge=challenge,
        defaults={"files": starter_files},
    )

    if created:
        return state

    if not state.files:
        state.files = starter_files
        state.save(update_fields=["files", "updated_at"])

    return state


class CodingChallengeListView(StudentExperienceBaseView):
    def get(self, request):
        student = self.get_student(request)
        states = StudentCodingChallengeState.objects.filter(student=student)
        state_map = {state.challenge_id: state for state in states}
        challenges = CodingChallenge.objects.filter(is_archived=False)
        serializer = CodingChallengeListSerializer(
            challenges,
            many=True,
            context={"state_map": state_map},
        )
        return Response({"results": serializer.data})


class CodingChallengeDetailView(StudentExperienceBaseView):
    def get(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        state = StudentCodingChallengeState.objects.filter(
            student=student, challenge=challenge
        ).first()
        serializer = CodingChallengeDetailSerializer(
            challenge,
            context={"state": state},
        )
        payload = serializer.data
        if state and state.is_completed and challenge.solution_files:
            payload["solution_files"] = challenge.solution_files
        return Response({"data": payload})


class CodingChallengeAutosaveView(StudentExperienceBaseView):
    def post(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        try:
            state = _ensure_state(student, challenge)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        files = request.data.get("files", [])
        try:
            normalised = normalise_execution_files(files)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        state.files = normalised
        state.save(update_fields=["files", "updated_at"])
        return Response(
            {
                "message": "Saved",
                "data": {"files": state.files},
            },
            status=status.HTTP_200_OK,
        )


class CodingChallengeResetView(StudentExperienceBaseView):
    def post(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        try:
            state = _ensure_state(student, challenge)
            starter = normalise_execution_files(challenge.starter_files or [])
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        state.files = starter
        state.last_run_result = {}
        state.last_run_at = None
        state.is_completed = False
        state.completed_at = None
        state.hints_revealed = 0
        state.last_hint_requested_at = None
        state.save(
            update_fields=[
                "files",
                "last_run_result",
                "last_run_at",
                "is_completed",
                "completed_at",
                "hints_revealed",
                "last_hint_requested_at",
                "updated_at",
            ]
        )
        return Response({"message": "Reset", "data": {"files": starter}})


class CodingChallengeRunView(StudentExperienceBaseView):
    def post(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        try:
            state = _ensure_state(student, challenge)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        files_payload = request.data.get("files")
        try:
            execution_files = normalise_execution_files(
                files_payload if files_payload is not None else (state.files or challenge.starter_files)
            )
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        stdin = request.data.get("stdin")
        if stdin is not None and not isinstance(stdin, str):
            return Response({"detail": "stdin must be a string."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = run_python_files(
                execution_files,
                challenge.entrypoint_filename,
                stdin=stdin,
                time_limit=challenge.time_limit_seconds,
                files_are_normalised=True,
            )
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        if files_payload is not None:
            state.files = execution_files

        state.last_run_result = {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.get("exit_code"),
            "timed_out": result.get("timed_out"),
            "type": "run",
        }
        state.last_run_at = timezone.now()
        state.save(update_fields=["files", "last_run_result", "last_run_at", "updated_at"])

        payload = dict(result)
        payload["files"] = state.files
        return Response({"data": payload})


class CodingChallengeSubmitView(StudentExperienceBaseView):
    def post(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        try:
            state = _ensure_state(student, challenge)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        files_payload = request.data.get("files")
        try:
            execution_files = normalise_execution_files(
                files_payload if files_payload is not None else (state.files or challenge.starter_files)
            )
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            passed, case_results = run_test_cases(
                execution_files,
                challenge.entrypoint_filename,
                challenge.test_cases,
                time_limit=challenge.time_limit_seconds,
            )
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        if files_payload is not None:
            state.files = execution_files

        state.last_run_result = {
            "type": "submit",
            "passed": passed,
            "cases": case_results,
        }
        state.last_run_at = timezone.now()
        updates = ["files", "last_run_result", "last_run_at", "updated_at"]
        if passed and not state.is_completed:
            state.is_completed = True
            state.completed_at = timezone.now()
            updates.extend(["is_completed", "completed_at"])
        state.save(update_fields=updates)

        response_payload = {
            "passed": passed,
            "cases": case_results,
            "files": state.files,
        }
        if passed and challenge.solution_files:
            response_payload["solution_files"] = challenge.solution_files
        return Response({"data": response_payload})


class CodingChallengeHintView(StudentExperienceBaseView):
    def post(self, request, slug: str):
        student = self.get_student(request)
        challenge = get_object_or_404(CodingChallenge, slug=slug, is_archived=False)
        hints = challenge.hints or []
        if not hints:
            return Response(
                {"detail": "Hints are not available for this challenge."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            state = _ensure_state(student, challenge)
        except CodeExecutionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        if state.last_hint_requested_at:
            elapsed = (now - state.last_hint_requested_at).total_seconds()
            if elapsed < HINT_COOLDOWN_SECONDS:
                return Response(
                    {
                        "detail": "Please wait before requesting another hint.",
                        "retry_in": max(int(HINT_COOLDOWN_SECONDS - elapsed), 1),
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )

        if state.hints_revealed >= len(hints):
            return Response(
                {"detail": "All hints have already been revealed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        state.hints_revealed += 1
        state.last_hint_requested_at = now
        state.save(update_fields=["hints_revealed", "last_hint_requested_at", "updated_at"])

        revealed = hints[: state.hints_revealed]
        return Response(
            {
                "data": {
                    "hint": revealed[-1],
                    "revealed": revealed,
                    "remaining": len(hints) - state.hints_revealed,
                }
            }
        )
