from __future__ import annotations

from django.db.models import Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from notifications.api.serializers import AnnouncementSerializer, NotificationSerializer
from notifications.models import Announcement, Notification
from students.api.views import StudentExperienceBaseView


class StudentNotificationListView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = self.get_student(request)
        notifications = Notification.objects.filter(user=request.user).order_by("-created_at")[:50]
        serializer = NotificationSerializer(notifications, many=True)
        unread_count = notifications.filter(read=False).count()
        return Response(
            {
                "message": "Successful",
                "data": {
                    "notifications": serializer.data,
                    "unread": unread_count,
                },
            }
        )

    def post(self, request):
        notification_id = request.data.get("notification_id")
        if not notification_id:
            return Response({"message": "Notification ID required"}, status=400)
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
        except Notification.DoesNotExist:
            return Response({"message": "Notification not found"}, status=404)
        notification.read = True
        notification.save(update_fields=["read", "updated_at"])
        return Response({"message": "Notification marked as read"})


class StudentAnnouncementListView(StudentExperienceBaseView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = self.get_student(request)
        course_id = request.query_params.get("course")
        now = timezone.now()
        queryset = Announcement.objects.filter(active=True, is_archived=False)
        if course_id:
            queryset = queryset.filter(audience=Announcement.AUDIENCE_COURSE, course__course_id=course_id)
        queryset = queryset.filter(Q(expires_at__gt=now) | Q(expires_at__isnull=True))
        queryset = queryset.order_by("-is_pinned", "-published_at")

        serializer = AnnouncementSerializer(queryset, many=True)
        return Response({"message": "Successful", "data": serializer.data})
