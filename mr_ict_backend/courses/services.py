from __future__ import annotations

from collections import defaultdict

from rest_framework.exceptions import ValidationError

from courses.models import Course, Lesson, Module, PublishStatus


def _ensure_field(value, message: str, errors: dict[str, list[str]], key: str) -> None:
    if not value:
        errors[key].append(message)


def validate_lesson_publishable(lesson: Lesson) -> None:
    errors: dict[str, list[str]] = defaultdict(list)
    _ensure_field(lesson.title, "Title is required before publishing.", errors, "title")
    _ensure_field(lesson.description, "Provide a learner-facing description.", errors, "description")

    has_primary_media = bool(lesson.content and lesson.content.strip()) or lesson.videos.exists()
    if not has_primary_media:
        errors["media"].append("Add lesson content or upload at least one video.")

    if errors:
        raise ValidationError(errors)


def validate_module_publishable(module: Module) -> None:
    errors: dict[str, list[str]] = defaultdict(list)
    _ensure_field(module.title, "Module title is required.", errors, "title")

    lessons = list(module.lessons.all())
    if not lessons:
        errors["lessons"].append("Add at least one lesson before publishing.")
    else:
        not_ready = []
        for lesson in lessons:
            try:
                validate_lesson_publishable(lesson)
            except ValidationError as exc:  # type: ignore[assignment]
                not_ready.append({"lesson": lesson.title, "issues": exc.detail})
        if not_ready:
            errors["lessons"].append(not_ready)

    if errors:
        raise ValidationError(errors)


def validate_course_publishable(course: Course) -> None:
    errors: dict[str, list[str]] = defaultdict(list)
    _ensure_field(course.title, "Course title is required.", errors, "title")
    _ensure_field(course.description, "Write a detailed course description.", errors, "description")

    modules = list(course.modules.order_by("order"))
    if not modules:
        errors["modules"].append("Create at least one module before publishing.")
    else:
        module_errors = []
        for module in modules:
            if module.status != PublishStatus.PUBLISHED:
                module_errors.append({
                    "module": module.title,
                    "status": module.status,
                    "message": "Module must be published before the course.",
                })
        if module_errors:
            errors["modules"].append(module_errors)

    if errors:
        raise ValidationError(errors)

