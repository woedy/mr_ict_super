
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
def get_student_homepage_data_view(request):
    payload = {}
    data = {}
    errors = {}

    user_data = {}
    notification_count = 0
    messages_count = 0
    challenge_badges = []

    course_overview_data = {}

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
    

    #User Data
    user_data['user_id'] = user.user_id
    user_data['first_name'] = user.first_name
    user_data['last_name'] = user.last_name
    user_data['photo'] = user.photo.url

    notifications = user.notifications.all().filter(read=False)
    notification_count = notifications.count()

    
    messages = user.student_messages.all().filter(read=False)
    messages_count = messages.count()


    badges = StudentBadge.objects.all().filter(student__user=user)
    badges_serializer = DashboardStudentBadgeSerializer(badges, many=True)
    if badges_serializer:
        badges_serializer = badges_serializer.data

    challenge_badges = badges_serializer



    ### Course Overview ###
    in_progress = StudentCourse.objects.filter(student__user=user, completed=False)
    completed_count = StudentCourse.objects.filter(student__user=user, completed=True)
    challenges_count = StudentChallenge.objects.filter(student__user=user, completed=True)

    course_overview_data['in_progress_count'] = in_progress.count()
    course_overview_data['completed_count'] = completed_count.count()
    course_overview_data['challenges_count'] = challenges_count.count()



    ### Resume Learning ###
    resume = StudentLesson.objects.filter(course__student__user=user, completed=False)
    resume_serializer = DashboardStudentCourseLessonSerializer(resume, many=True)
    if resume_serializer:
        resume_serializer = resume_serializer.data

    resume_learning = resume_serializer

    ### All Couses ###

    all_courses = Course.objects.filter(is_archived=False)
    all_courses_serializer = DashboardCourseSerializer(all_courses, many=True)
    if all_courses_serializer:
        all_courses_serializer = all_courses_serializer.data
    
    available_coures = all_courses_serializer

    

    ### All Challenges ###

    #HTML
    html_challenges = CodingChallenge.objects.filter(is_archived=False, course__title='HTML')[:5]
    html_challenges_serializer = DashboardCodingChallengeSerializer(html_challenges, many=True)
    if html_challenges_serializer:
        html_challenges_serializer = html_challenges_serializer.data

    available_html_challenges = html_challenges_serializer

    #CSS
    css_challenges = CodingChallenge.objects.filter(is_archived=False, course__title='CSS')[:5]
    css_challenges_serializer = DashboardCodingChallengeSerializer(css_challenges, many=True)
    if css_challenges_serializer:
        css_challenges_serializer = css_challenges_serializer.data

    available_css_challenges = css_challenges_serializer

    #Javascript
    javascript_challenges = CodingChallenge.objects.filter(is_archived=False, course__title='Javascript')[:5]
    javascript_challenges_serializer = DashboardCodingChallengeSerializer(javascript_challenges, many=True)
    if javascript_challenges_serializer:
        javascript_challenges_serializer = javascript_challenges_serializer.data

    available_javascript_challenges = javascript_challenges_serializer

    #Python
    python_challenges = CodingChallenge.objects.filter(is_archived=False, course__title='Python')[:5]
    python_challenges_serializer = DashboardCodingChallengeSerializer(python_challenges, many=True)
    if python_challenges_serializer:
        python_challenges_serializer = python_challenges_serializer.data
        
    available_python_challenges = python_challenges_serializer





    ##### Final data ###################

    data['user_data'] = user_data
    data['notification_count'] = notification_count
    data['messages_count'] = messages_count
    data['challenge_badges'] = challenge_badges

    data['resume_learning'] = resume_learning
    data['available_coures'] = available_coures

    data['available_html_challenges'] = available_html_challenges
    data['available_css_challenges'] = available_css_challenges
    data['available_javascript_challenges'] = available_javascript_challenges
    data['available_python_challenges'] = available_python_challenges


    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)





