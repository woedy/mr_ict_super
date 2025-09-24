from django.urls import path

from notifications.api.views import StudentAnnouncementListView, StudentNotificationListView

app_name = 'notifications_api'

urlpatterns = [
    path('student/', StudentNotificationListView.as_view(), name='student-notifications'),
    path('student/announcements/', StudentAnnouncementListView.as_view(), name='student-announcements'),
]
