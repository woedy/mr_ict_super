from __future__ import annotations

import csv
import io
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Any, Dict, Iterable, Optional

from django.db.models import Count, Q
from django.utils import timezone

from analytics.models import DailyEngagementSummary, LearningEvent
from courses.models import CodingChallenge, Course, Lesson, PublishStatus
from notifications.models import Announcement
from students.models import Student, StudentCertificate, StudentCourse


@dataclass(frozen=True)
class AdminSummary:
    stats: Dict[str, Any]
    recent_activity: Iterable[Dict[str, Any]]
    timeseries: Iterable[Dict[str, Any]]
    top_courses: Iterable[Dict[str, Any]]
    announcements: Iterable[Dict[str, Any]]


def _window_for_date(target_date: date) -> tuple[datetime, datetime]:
    tz = timezone.get_current_timezone()
    start = timezone.make_aware(datetime.combine(target_date, time.min), timezone=tz)
    end = start + timedelta(days=1)
    return start, end


def record_event(
    *,
    event_type: str,
    user=None,
    student=None,
    course=None,
    lesson=None,
    assessment=None,
    source: str = LearningEvent.SOURCE_BACKEND,
    occurred_at: Optional[datetime] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> LearningEvent:
    """Persist a new learning event for analytics."""

    if occurred_at is None:
        occurred_at = timezone.now()
    payload = {
        "event_type": event_type,
        "source": source,
        "occurred_at": occurred_at,
        "metadata": metadata or {},
    }
    if user is not None:
        payload["user"] = user
    if student is not None:
        payload["student"] = student
    if course is not None:
        payload["course"] = course
    if lesson is not None:
        payload["lesson"] = lesson
    if assessment is not None:
        payload["assessment"] = assessment

    return LearningEvent.objects.create(**payload)


def generate_daily_summary(target_date: Optional[date] = None) -> DailyEngagementSummary:
    """Aggregate daily metrics for dashboards and reporting."""

    if target_date is None:
        target_date = timezone.localdate()

    start, end = _window_for_date(target_date)

    events = LearningEvent.objects.filter(occurred_at__gte=start, occurred_at__lt=end)

    summary, _ = DailyEngagementSummary.objects.get_or_create(date=target_date)
    summary.total_students = Student.objects.filter(created_at__lte=end).count()
    summary.new_students = Student.objects.filter(created_at__gte=start, created_at__lt=end).count()
    summary.active_students = events.exclude(student__isnull=True).values("student").distinct().count()
    summary.lessons_viewed = events.filter(event_type=LearningEvent.TYPE_LESSON_VIEWED).count()
    summary.lessons_completed = events.filter(event_type=LearningEvent.TYPE_LESSON_COMPLETED).count()
    summary.courses_completed = events.filter(event_type=LearningEvent.TYPE_COURSE_COMPLETED).count()
    summary.assessments_completed = events.filter(event_type=LearningEvent.TYPE_ASSESSMENT_COMPLETED).count()
    summary.comments_posted = events.filter(event_type=LearningEvent.TYPE_COMMENT_CREATED).count()

    xp_total = 0
    for event in events.filter(event_type=LearningEvent.TYPE_XP_AWARDED):
        amount = event.metadata.get("amount") if isinstance(event.metadata, dict) else 0
        try:
            xp_total += int(amount)
        except (TypeError, ValueError):
            continue
    summary.xp_earned = xp_total

    summary.certificates_issued = StudentCertificate.objects.filter(
        issued_at__gte=start,
        issued_at__lt=end,
    ).count()

    summary.metadata = {
        "announcements_published": Announcement.objects.filter(
            published_at__gte=start,
            published_at__lt=end,
        ).count(),
        "courses_completed_today": StudentCourse.objects.filter(
            completed=True,
            updated_at__gte=start,
            updated_at__lt=end,
        ).count(),
    }
    summary.save()
    return summary


def backfill_daily_summaries(start_date: date, end_date: date) -> list[DailyEngagementSummary]:
    """Compute engagement summaries for every day in the inclusive range."""

    if start_date > end_date:
        raise ValueError("start_date cannot be after end_date")

    summaries: list[DailyEngagementSummary] = []
    current = start_date
    while current <= end_date:
        summaries.append(generate_daily_summary(current))
        current += timedelta(days=1)
    return summaries


def _summaries_for_range(days: int = 7) -> list[DailyEngagementSummary]:
    if days <= 0:
        return []

    today = timezone.localdate()
    start = today - timedelta(days=days - 1)
    return backfill_daily_summaries(start, today)


def _describe_event(event: LearningEvent) -> Dict[str, Any]:
    student_name = None
    if event.student and event.student.user:
        user = event.student.user
        student_name = f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip()
        if not student_name:
            student_name = getattr(user, "email", "") or getattr(user, "username", "")

    description = {
        LearningEvent.TYPE_LESSON_VIEWED: "viewed a lesson",
        LearningEvent.TYPE_LESSON_COMPLETED: "completed a lesson",
        LearningEvent.TYPE_COURSE_COMPLETED: "completed a course",
        LearningEvent.TYPE_ASSESSMENT_STARTED: "started an assessment",
        LearningEvent.TYPE_ASSESSMENT_COMPLETED: "finished an assessment",
        LearningEvent.TYPE_XP_AWARDED: "earned XP",
        LearningEvent.TYPE_COMMENT_CREATED: "posted in lesson discussion",
        LearningEvent.TYPE_ANNOUNCEMENT_PUBLISHED: "published an announcement",
        LearningEvent.TYPE_NOTIFICATION_READ: "read a notification",
    }.get(event.event_type, event.event_type.replace("_", " "))

    context = None
    if event.lesson:
        context = event.lesson.title
    elif event.course:
        context = event.course.title
    elif event.assessment:
        context = event.assessment.title

    return {
        "id": event.id,
        "event_type": event.event_type,
        "description": description,
        "actor": student_name,
        "context": context,
        "occurred_at": event.occurred_at,
        "metadata": event.metadata,
    }


def build_admin_summary() -> AdminSummary:
    today_summary = generate_daily_summary()
    stats = {
        "totalStudents": today_summary.total_students,
        "activeStudentsToday": today_summary.active_students,
        "newStudentsToday": today_summary.new_students,
        "lessonsViewedToday": today_summary.lessons_viewed,
        "lessonsCompletedToday": today_summary.lessons_completed,
        "coursesCompletedToday": today_summary.metadata.get("courses_completed_today", 0),
        "assessmentsCompletedToday": today_summary.assessments_completed,
        "commentsPostedToday": today_summary.comments_posted,
        "xpAwardedToday": today_summary.xp_earned,
        "certificatesIssuedToday": today_summary.certificates_issued,
        "activeCourses": Course.objects.filter(status=PublishStatus.PUBLISHED, is_archived=False).count(),
        "totalLessons": Lesson.objects.filter(status=PublishStatus.PUBLISHED, is_archived=False).count(),
        "totalChallenges": CodingChallenge.objects.filter(is_archived=False).count(),
    }

    recent_events = [
        _describe_event(event)
        for event in LearningEvent.objects.select_related(
            "student__user", "lesson", "course", "assessment"
        ).order_by("-occurred_at")[:20]
    ]

    summaries = _summaries_for_range(days=7)
    timeseries = [
        {
            "date": summary.date,
            "activeStudents": summary.active_students,
            "lessonsCompleted": summary.lessons_completed,
            "assessmentsCompleted": summary.assessments_completed,
            "xpAwarded": summary.xp_earned,
        }
        for summary in summaries
    ]

    course_stats = (
        StudentCourse.objects.select_related("course")
        .values("course__course_id", "course__title")
        .annotate(
            enrollments=Count("id"),
            completions=Count("id", filter=Q(completed=True)),
        )
        .order_by("-enrollments")[:5]
    )
    top_courses = []
    for entry in course_stats:
        enrollments = entry["enrollments"] or 0
        completions = entry["completions"] or 0
        completion_rate = 0.0
        if enrollments:
            completion_rate = round((completions / enrollments) * 100, 2)
        top_courses.append(
            {
                "courseId": entry["course__course_id"],
                "title": entry["course__title"],
                "enrollments": enrollments,
                "completions": completions,
                "completionRate": completion_rate,
            }
        )

    announcements = [
        {
            "id": announcement.id,
            "title": announcement.title,
            "audience": announcement.audience,
            "published_at": announcement.published_at,
            "expires_at": announcement.expires_at,
            "course": announcement.course.course_id if announcement.course else None,
        }
        for announcement in Announcement.objects.filter(
            active=True,
            is_archived=False,
        )
        .select_related("course")
        .order_by("-published_at")[:5]
    ]

    return AdminSummary(
        stats=stats,
        recent_activity=recent_events,
        timeseries=timeseries,
        top_courses=top_courses,
        announcements=announcements,
    )


def admin_summary_as_csv(summary: AdminSummary) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    for key, value in summary.stats.items():
        writer.writerow([key, value])
    writer.writerow([])
    writer.writerow(["Date", "Active Students", "Lessons Completed", "Assessments Completed", "XP Awarded"])
    for row in summary.timeseries:
        writer.writerow(
            [
                row.get("date"),
                row.get("activeStudents"),
                row.get("lessonsCompleted"),
                row.get("assessmentsCompleted"),
                row.get("xpAwarded"),
            ]
        )
    return output.getvalue()
