from django.urls import path

from homepage.views.student_views import get_student_homepage_data_view
from homepage.views.admin_views import get_admin_dashboard_data_view


app_name = 'homepage'

urlpatterns = [
    path('student-dashboard/', get_student_homepage_data_view, name="get_student_homepage_data_view"),
    path('admin-dashboard/', get_admin_dashboard_data_view, name="get_admin_dashboard_data_view"),

]
