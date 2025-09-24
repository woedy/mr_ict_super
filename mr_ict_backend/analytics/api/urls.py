from django.urls import path

from analytics.api.views import (
    AdminAnalyticsSummaryExportView,
    AdminAnalyticsSummaryView,
    LearningEventIngestView,
)

app_name = "analytics"

urlpatterns = [
    path("events/", LearningEventIngestView.as_view(), name="events"),
    path("admin/summary/", AdminAnalyticsSummaryView.as_view(), name="admin-summary"),
    path(
        "admin/summary/export/",
        AdminAnalyticsSummaryExportView.as_view(),
        name="admin-summary-export",
    ),
]
