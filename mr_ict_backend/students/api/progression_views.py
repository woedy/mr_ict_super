from __future__ import annotations

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from assessments.models import StudentQuizAttempt
from students.api.views import StudentExperienceBaseView
from students.models import StudentBadge, StudentCertificate, StudentXPEvent


class StudentProgressSummaryView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = self.get_student(request)

        xp_events = StudentXPEvent.objects.filter(student=student).order_by("-created_at")[:20]
        badges = StudentBadge.objects.filter(student=student).select_related("badge", "coding_challenge")
        certificates = StudentCertificate.objects.filter(student=student, is_archived=False, active=True)
        assessment_attempts = StudentQuizAttempt.objects.filter(student=student).select_related("assessment")[:10]

        payload = {
            "xp": {
                "total": student.epz,
                "events": [
                    {
                        "id": event.pk,
                        "amount": event.amount,
                        "source": event.source,
                        "description": event.description,
                        "reference": event.reference,
                        "balance_after": event.balance_after,
                        "created_at": event.created_at,
                    }
                    for event in xp_events
                ],
            },
            "badges": [
                {
                    "id": badge.pk,
                    "name": badge.badge.badge_name if badge.badge else None,
                    "criteria": badge.badge.criteria if badge.badge else None,
                    "image": request.build_absolute_uri(badge.badge.image.url)
                    if badge.badge and badge.badge.image
                    else None,
                    "challenge_title": badge.coding_challenge.title if badge.coding_challenge else None,
                    "earned_at": badge.earned_at,
                }
                for badge in badges
            ],
            "certificates": [
                {
                    "id": certificate.pk,
                    "title": certificate.title,
                    "issued_at": certificate.issued_at,
                    "issued_by": certificate.issued_by,
                    "description": certificate.description,
                    "download_url": certificate.download_url,
                }
                for certificate in certificates
            ],
            "recent_assessments": [
                {
                    "id": attempt.pk,
                    "assessment": {
                        "title": attempt.assessment.title,
                        "slug": attempt.assessment.slug,
                        "lesson_title": attempt.assessment.lesson.title if attempt.assessment.lesson else None,
                    },
                    "score": attempt.score,
                    "percentage": attempt.percentage_score,
                    "status": attempt.status,
                    "awarded_xp": attempt.awarded_xp,
                    "completed_at": attempt.completed_at,
                }
                for attempt in assessment_attempts
            ],
        }

        return Response({"message": "Successful", "data": payload})
