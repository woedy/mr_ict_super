from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from courses.models import CodingChallenge, Course
from students.models import StudentBadge, StudentChallenge, StudentCourse, StudentLesson




@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication, ])
def get_student_homepage_data_view(request):
    def absolute_media_url(image_field):
        if not image_field:
            return None
        try:
            url = image_field.url
        except (AttributeError, ValueError):
            return None
        return request.build_absolute_uri(url) if request is not None else url

    def serialize_resume_item(item):
        lesson = getattr(item, "lesson", None)
        student_course = getattr(item, "course", None)
        course = getattr(student_course, "course", None)

        return {
            "student_lesson_id": item.pk,
            "lesson_id": getattr(lesson, "lesson_id", None),
            "lesson_title": getattr(lesson, "title", ""),
            "course_id": getattr(course, "course_id", None),
            "course_title": getattr(course, "title", ""),
            "lessons_completed": getattr(student_course, "lessons_completed", 0),
            "total_lessons": getattr(student_course, "total_lessons", 0),
            "progress_percent": float(student_course.progress_percent) if getattr(student_course, "progress_percent", None) is not None else None,
            "thumbnail": absolute_media_url(getattr(lesson, "thumbnail", None)) if lesson else None,
            "updated_at": item.updated_at,
        }

    def serialize_course(course):
        return {
            "course_id": course.course_id,
            "title": course.title,
            "summary": course.summary,
            "description": course.description,
            "level": course.level,
            "estimated_duration_minutes": course.estimated_duration_minutes,
            "image": absolute_media_url(course.image),
            "slug": course.slug,
        }

    def serialize_badge(badge):
        challenge = getattr(badge, "coding_challenge", None)
        challenge_title = getattr(challenge, "title", None)
        return {
            "id": badge.pk,
            "name": getattr(badge.badge, "badge_name", ""),
            "criteria": getattr(badge.badge, "criteria", ""),
            "image": absolute_media_url(getattr(badge.badge, "image", None)),
            "challenge_title": challenge_title,
            "earned_at": badge.earned_at,
        }

    def serialize_challenge(challenge):
        return {
            "id": challenge.pk,
            "title": challenge.title,
            "difficulty": challenge.difficulty,
            "course_title": getattr(challenge.course, "title", ""),
        }

    payload = {}
    data = {}
    errors = {}

    user_id = request.query_params.get('user_id')

    if not user_id:
        errors['user_id'] = ["User ID is required."]

    user = None
    if not errors:
        try:
            user = get_user_model().objects.get(user_id=user_id)
        except get_user_model().DoesNotExist:
            errors['user_id'] = ['User does not exist.']

    if errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    user_data = {
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "photo": absolute_media_url(getattr(user, "photo", None)),
    }

    notifications = user.notifications.filter(read=False)
    messages = user.student_messages.filter(read=False)

    badges = StudentBadge.objects.filter(student__user=user).select_related('badge', 'coding_challenge')
    resume_queryset = (
        StudentLesson.objects.filter(course__student__user=user, completed=False)
        .select_related('lesson', 'course__course')
        .order_by('-updated_at')[:5]
    )
    all_courses = Course.objects.filter(is_archived=False)

    def challenges_for_course_title(title):
        return CodingChallenge.objects.filter(
            is_archived=False,
            course__title__iexact=title,
        ).select_related('course')[:5]

    data['user_data'] = user_data
    data['notification_count'] = notifications.count()
    data['messages_count'] = messages.count()
    data['challenge_badges'] = [serialize_badge(b) for b in badges]

    in_progress = StudentCourse.objects.filter(student__user=user, completed=False)
    completed_count = StudentCourse.objects.filter(student__user=user, completed=True)
    challenges_count = StudentChallenge.objects.filter(student__user=user, completed=True)

    data['course_overview'] = {
        "in_progress": in_progress.count(),
        "completed": completed_count.count(),
        "challenges_completed": challenges_count.count(),
    }

    data['resume_learning'] = [serialize_resume_item(item) for item in resume_queryset]
    data['available_courses'] = [serialize_course(course) for course in all_courses]

    data['available_html_challenges'] = [serialize_challenge(ch) for ch in challenges_for_course_title('HTML')]
    data['available_css_challenges'] = [serialize_challenge(ch) for ch in challenges_for_course_title('CSS')]
    data['available_javascript_challenges'] = [serialize_challenge(ch) for ch in challenges_for_course_title('Javascript')]
    data['available_python_challenges'] = [serialize_challenge(ch) for ch in challenges_for_course_title('Python')]

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)





