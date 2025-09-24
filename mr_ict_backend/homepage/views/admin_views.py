from __future__ import annotations

from dataclasses import asdict

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from analytics.services import build_admin_summary


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_admin_dashboard_data_view(request):
    payload: dict[str, object] = {}
    data: dict[str, object] = {}
    errors: dict[str, object] = {}

    user_id = request.query_params.get("user_id")
    if user_id:
        try:
            get_user_model().objects.get(user_id=user_id)
        except get_user_model().DoesNotExist:
            errors["user_id"] = ["User does not exist."]
    if errors:
        payload["message"] = "Errors"
        payload["errors"] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    summary = build_admin_summary()
    summary_dict = asdict(summary)
    data["stats"] = summary_dict.get("stats", {})
    data["recentActivity"] = summary_dict.get("recent_activity", [])
    data["timeseries"] = summary_dict.get("timeseries", [])
    data["topCourses"] = summary_dict.get("top_courses", [])
    data["announcements"] = summary_dict.get("announcements", [])

    payload["message"] = "Successful"
    payload["data"] = data
    return Response(payload, status=status.HTTP_200_OK)
