from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List

from django.utils import timezone

from assessments.models import Assessment, Question


@dataclass
class QuestionResult:
    question_id: int
    correct: bool
    earned_points: int
    possible_points: int
    feedback: str


@dataclass
class AssessmentResult:
    assessment: Assessment
    total_points: int
    earned_points: int
    percentage: float
    passed: bool
    question_results: List[QuestionResult]
    completed_at: datetime


def _parse_answer(raw: str | list | bool | None) -> Any:
    if isinstance(raw, (list, bool, int, float)):
        return raw
    if raw is None:
        return None
    raw_str = str(raw).strip()
    if not raw_str:
        return None
    try:
        return json.loads(raw_str)
    except (TypeError, json.JSONDecodeError):
        return raw_str


def grade_assessment(assessment: Assessment, answers: Dict[str, Any]) -> AssessmentResult:
    total_points = 0
    earned_points = 0
    question_results: List[QuestionResult] = []

    questions = assessment.questions.filter(is_archived=False, active=True).order_by("order", "id")
    for question in questions:
        total_points += question.points
        submitted_answer = answers.get(str(question.id)) or answers.get(question.id)
        submitted_normalised = _parse_answer(submitted_answer)
        correct_answer = _parse_answer(question.correct_answer)
        feedback = ""
        correct = False

        if question.question_type == Question.MULTIPLE_CHOICE:
            if isinstance(correct_answer, list):
                submitted_set = set(map(str, submitted_normalised or []))
                correct_set = set(map(str, correct_answer))
                correct = submitted_set == correct_set
            else:
                correct = str(submitted_normalised).strip().lower() == str(correct_answer).strip().lower()
        elif question.question_type == Question.TRUE_FALSE:
            def _to_bool(value: Any) -> bool:
                if isinstance(value, bool):
                    return value
                if value is None:
                    return False
                return str(value).strip().lower() in {"true", "1", "yes"}

            correct = _to_bool(submitted_normalised) == _to_bool(correct_answer)
        else:  # FREE_RESPONSE
            if submitted_normalised is None:
                correct = False
            else:
                correct = str(submitted_normalised).strip().lower() == str(correct_answer).strip().lower()

        earned = question.points if correct else 0
        earned_points += earned

        if not correct and question.explanation:
            feedback = question.explanation

        question_results.append(
            QuestionResult(
                question_id=question.id,
                correct=correct,
                earned_points=earned,
                possible_points=question.points,
                feedback=feedback,
            )
        )

    percentage = 0.0
    if total_points:
        percentage = (earned_points / total_points) * 100
    passed = percentage >= assessment.passing_score

    return AssessmentResult(
        assessment=assessment,
        total_points=total_points,
        earned_points=earned_points,
        percentage=round(percentage, 2),
        passed=passed,
        question_results=question_results,
        completed_at=timezone.now(),
    )
