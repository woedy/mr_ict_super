from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from django.db import transaction
from django.utils import timezone

from analytics.models import LearningEvent
from analytics.services import record_event
from assessments.models import Assessment
from courses.models import ChallengeBadge, Course
from students.models import Student, StudentBadge, StudentCertificate, StudentXPEvent


@dataclass
class RewardOutcome:
    xp_awarded: int = 0
    badge_awarded: Optional[StudentBadge] = None
    certificate_awarded: Optional[StudentCertificate] = None


@transaction.atomic
def award_xp(
    *,
    student: Student,
    amount: int,
    source: str,
    reference: str = "",
    description: str = "",
) -> StudentXPEvent:
    if amount == 0:
        # still record the event for transparency
        balance_after = student.epz
    else:
        new_balance = student.epz + amount
        if new_balance < 0:
            new_balance = 0
        student.epz = new_balance
        student.save(update_fields=["epz", "updated_at"])
        balance_after = new_balance

    event = StudentXPEvent.objects.create(
        student=student,
        source=source,
        reference=reference,
        amount=amount,
        balance_after=balance_after,
        description=description,
    )
    record_event(
        event_type=LearningEvent.TYPE_XP_AWARDED,
        user=student.user,
        student=student,
        course=None,
        lesson=None,
        metadata={
            "amount": event.amount,
            "balance_after": event.balance_after,
            "source": source,
            "reference": reference,
        },
    )
    return event


@transaction.atomic
def ensure_badge(
    *,
    student: Student,
    badge: Optional[ChallengeBadge],
    challenge=None,
) -> Optional[StudentBadge]:
    if not badge:
        return None
    existing = StudentBadge.objects.filter(student=student, badge=badge).first()
    if existing:
        return existing
    return StudentBadge.objects.create(student=student, badge=badge, coding_challenge=challenge)


@transaction.atomic
def issue_certificate(
    *,
    student: Student,
    assessment: Optional[Assessment] = None,
    course: Optional[Course] = None,
    title: str,
    description: str = "",
    issued_by: str = "",
    download_url: str = "",
) -> StudentCertificate:
    defaults = {
        "description": description,
        "issued_by": issued_by,
        "download_url": download_url,
        "active": True,
        "is_archived": False,
        "updated_at": timezone.now(),
    }
    certificate, _created = StudentCertificate.objects.update_or_create(
        student=student,
        assessment=assessment,
        course=course,
        title=title,
        defaults=defaults,
    )
    return certificate


@transaction.atomic
def process_assessment_rewards(
    *,
    student: Student,
    assessment: Assessment,
    xp_amount: Optional[int] = None,
    certificate_title: Optional[str] = None,
    certificate_description: str = "",
    issued_by: str = "Mr ICT",
) -> RewardOutcome:
    outcome = RewardOutcome()

    if xp_amount is None:
        xp_amount = assessment.reward_xp

    if xp_amount:
        event = award_xp(
            student=student,
            amount=xp_amount,
            source=StudentXPEvent.SOURCE_ASSESSMENT,
            reference=assessment.slug,
            description=f"Assessment reward for {assessment.title}",
        )
        outcome.xp_awarded = event.amount

    badge = ensure_badge(student=student, badge=assessment.reward_badge)
    if badge:
        outcome.badge_awarded = badge

    if assessment.issues_certificate or certificate_title:
        title = certificate_title or assessment.certificate_title or f"{assessment.title} Certificate"
        certificate = issue_certificate(
            student=student,
            assessment=assessment,
            course=assessment.lesson.course if hasattr(assessment.lesson, "course") else None,
            title=title,
            description=certificate_description,
            issued_by=issued_by,
        )
        outcome.certificate_awarded = certificate

    return outcome
