from __future__ import annotations

from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from analytics.services import backfill_daily_summaries


class Command(BaseCommand):
    help = "Recompute analytics daily summaries for a date range."

    def add_arguments(self, parser):
        parser.add_argument(
            "--start",
            dest="start",
            help="Start date (inclusive) in YYYY-MM-DD format.",
        )
        parser.add_argument(
            "--end",
            dest="end",
            help="End date (inclusive) in YYYY-MM-DD format. Defaults to today if omitted.",
        )
        parser.add_argument(
            "--days",
            dest="days",
            type=int,
            default=7,
            help=(
                "Number of days to backfill ending today when start/end are not supplied. "
                "Must be positive."
            ),
        )

    def handle(self, *args, **options):
        start_value = options.get("start")
        end_value = options.get("end")
        days = options.get("days")

        if days is not None and days <= 0:
            raise CommandError("--days must be a positive integer")

        def parse_date(raw: str, label: str) -> date:
            try:
                return date.fromisoformat(raw)
            except ValueError as exc:
                raise CommandError(f"Invalid {label} date '{raw}': {exc}") from exc

        start = parse_date(start_value, "start") if start_value else None
        end = parse_date(end_value, "end") if end_value else None

        today = timezone.localdate()

        if start and end and start > end:
            raise CommandError("Start date cannot be after end date")

        if start and not end:
            span = days - 1 if days else 0
            end = min(start + timedelta(days=span), today)
        elif end and not start:
            span = days - 1 if days else 0
            start = end - timedelta(days=span)
        elif not start and not end:
            end = today
            start = end - timedelta(days=days - 1) if days else end

        if end and end > today:
            end = today
        if start and start > today:
            raise CommandError("Start date cannot be in the future")

        # By this point both start and end should be populated
        assert start is not None and end is not None  # for type checkers

        summaries = backfill_daily_summaries(start, end)
        self.stdout.write(
            self.style.SUCCESS(
                f"Computed {len(summaries)} daily summary(ies) from {start.isoformat()} to {end.isoformat()}"
            )
        )
