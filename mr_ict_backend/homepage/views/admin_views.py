
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import CodingChallenge, Course
from homepage.serializers import DashboardCodingChallengeSerializer, DashboardCourseSerializer, DashboardStudentBadgeSerializer, DashboardStudentCourseLessonSerializer
from students.models import StudentBadge, StudentChallenge, StudentCourse, StudentLesson




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([TokenAuthentication, ])
def get_admin_dashboard_data_view(request):
    payload = {}
    data = {}
    errors = {}

    user_data = {}
    stats_data = {}
    total_students = 0
    active_courses = 0
    total_lessons = 0
    total_callenges = 0
    new_students_today = 0
    courses_comleted_today = 0

    recent_platform_activities = []

    todays_hihlights = {}
    top_performing_coures = []
    student_reach = []

    resume_learning = []

    available_html_challenges = []
    available_css_challenges = []
    available_javascript_challenges = []
    available_python_challenges = []



    user_id = request.query_params.get('user_id', None)
    
    if user_id is None:
        errors['user_id'] = "User ID is required"

    try:
        user = get_user_model().objects.get(user_id=user_id)
    except:
        errors['user_id'] = ['User does not exist.']    
        
    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)
    

    #States Data
    stats_data["totalStudents"] = total_students
    stats_data["activeCourses"] = active_courses
    stats_data["totalLessons"] = total_lessons
    stats_data["totalChallenges"] = total_callenges
    stats_data["newStudentsToday"] = new_students_today
    stats_data["coursesCompletedToday"] = courses_comleted_today


    data["stats"] = stats_data




    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



