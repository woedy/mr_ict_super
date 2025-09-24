from __future__ import annotations

from celery import current_app
from django.core.cache import caches
from django.db import connection
from django.http import JsonResponse


def health_check_view(request):
    checks: dict[str, str] = {}

    # Database connectivity
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        checks["database"] = "ok"
    except Exception as exc:  # pragma: no cover - recorded in response
        checks["database"] = f"error: {exc}"

    # Cache / Redis availability (if configured)
    try:
        cache = caches["default"]
        cache.set("healthcheck", "ok", timeout=5)
        cache.get("healthcheck")
        checks["cache"] = "ok"
    except Exception as exc:  # pragma: no cover - recorded in response
        checks["cache"] = f"error: {exc}"

    # Celery worker heartbeat
    try:
        responses = current_app.control.ping(timeout=0.5)
        checks["celery"] = "ok" if responses else "unreachable"
    except Exception as exc:  # pragma: no cover - recorded in response
        checks["celery"] = f"error: {exc}"

    overall = "ok" if all(value == "ok" for value in checks.values()) else "degraded"
    return JsonResponse({"status": overall, "checks": checks})
