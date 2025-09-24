from django.urls import path

from assessments.api.views import (
    StudentAssessmentAttemptView,
    StudentAssessmentDetailView,
    StudentAssessmentListView,
)

app_name = "assessments_api"

urlpatterns = [
    path("student/", StudentAssessmentListView.as_view(), name="student-assessment-list"),
    path("student/<slug:slug>/", StudentAssessmentDetailView.as_view(), name="student-assessment-detail"),
    path("student/<slug:slug>/attempt/", StudentAssessmentAttemptView.as_view(), name="student-assessment-attempt"),
]
