from __future__ import annotations

from datetime import date
from typing import Optional

from celery import shared_task
from django.utils import timezone

from analytics.services import generate_daily_summary


@shared_task(name="analytics.compute_daily_summary")
def compute_daily_summary_task(target_date: Optional[str] = None) -> str:
    """Compute the engagement summary for the supplied date (defaults to today)."""

    if target_date:
        parsed_date = date.fromisoformat(target_date)
    else:
        parsed_date = timezone.localdate()
    summary = generate_daily_summary(parsed_date)
    return f"Summary computed for {summary.date.isoformat()}"


@shared_task(name="analytics.compute_today_summary")
def compute_today_summary_task() -> str:
    """Convenience task for beat schedules that always runs for today."""

    summary = generate_daily_summary()
    return f"Summary computed for {summary.date.isoformat()}"
