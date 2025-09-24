from django.urls import path

from students.api.coding_views import (
    CodingChallengeAutosaveView,
    CodingChallengeDetailView,
    CodingChallengeHintView,
    CodingChallengeListView,
    CodingChallengeResetView,
    CodingChallengeRunView,
    CodingChallengeSubmitView,
)
from students.api.project_views import (
    StudentProjectDetailView,
    StudentProjectListCreateView,
    StudentProjectPublishView,
    StudentProjectValidateView,
)
from students.api.engagement_views import LessonCommentLikeView, LessonCommentListCreateView
from students.api.progression_views import StudentProgressSummaryView
from students.api.views import (
    CourseCatalogView,
    CourseDetailView,
    CourseEnrollmentView,
    LessonPlaybackView,
    LessonProgressView,
    StudentDashboardView,
    StudentProfileView,
)
from students.views.student_courses_views import add_student_course_view, get_all_student_courses_view, get_student_course_details_view
from students.views.student_lesson_feedback_views import add_student_lesson_feedback_view
from students.views.student_lesson_notes_views import add_student_lesson_note_view, get_all_student_lesson_notes_view, get_student_lesson_note_details_view
from students.views.student_lessons_views import add_student_lesson_view, get_all_student_lessons_view, get_student_lesson_details_view
from students.views.student_views import archive_student, delete_student, get_all_archived_students_view, get_all_students_view, get_student_details_view, unarchive_student



app_name = 'students'

urlpatterns = [
    ## STUDENT

    #path('add-student/', add_student_view, name="add_student_view"),
    path('get-all-students/', get_all_students_view, name="get_all_students_view"),
    #path('edit-student/', edit_student, name="edit_student_view"),
    path('get-student-details/', get_student_details_view, name="get_student_detail_view"),
    path('archive-student/', archive_student, name="archive_student"),
    path('unarchive-student/', unarchive_student, name="unarchive_student"),
    path('get-all-archived-students/', get_all_archived_students_view, name="get_all_archived_student_view"),
    path('delete-student/', delete_student, name="delete_student"),
    
  
    path('add-student-course/', add_student_course_view, name="add_student_course_view"),
    path('get-all-student-courses/', get_all_student_courses_view, name="get_all_student_courses_view"),
    #path('edit-student-course/', edit_student_course, name="edit_student_course_view"),
    path('get-student-course-details/', get_student_course_details_view, name="get_student_course_detail_view"),
    #path('delete-student-course/', delete_student_course, name="delete_student_course"),
  
    path('add-student-lesson/', add_student_lesson_view, name="add_student_lesson_view"),
    path('get-all-student-lessons/', get_all_student_lessons_view, name="get_all_student_lessons_view"),
    #path('edit-student-lesson/', edit_student_lesson, name="edit_student_lesson_view"),
    path('get-student-lesson-details/', get_student_lesson_details_view, name="get_student_lesson_detail_view"),
    #path('delete-student-lesson/', delete_student_lesson, name="delete_student_lesson"),
  
    path('add-lesson-note/', add_student_lesson_note_view, name="add_student_lesson_note_view"),
    path('get-all-lesson-notes/', get_all_student_lesson_notes_view, name="get_all_student_lessons_view"),
    #path('edit-student-lesson/', edit_student_lesson, name="edit_student_lesson_view"),
    path('get-lesson-note-details/', get_student_lesson_note_details_view, name="get_student_lesson_note_details_view"),
    #path('delete-student-lesson/', delete_student_lesson, name="delete_student_lesson"),

    path('add-lesson-feedback/', add_student_lesson_feedback_view, name="add_student_lesson_feedback_view"),
    path('get-all-lesson-notes/', get_all_student_lesson_notes_view, name="get_all_student_lessons_view"),
    #path('edit-student-lesson/', edit_student_lesson, name="edit_student_lesson_view"),
    path('get-lesson-note-details/', get_student_lesson_note_details_view, name="get_student_lesson_note_details_view"),
    #path('delete-student-lesson/', delete_student_lesson, name="delete_student_lesson"),



    path('experience/me/', StudentProfileView.as_view(), name='student_profile'),
    path('experience/dashboard/', StudentDashboardView.as_view(), name='student_dashboard'),
    path('experience/catalog/', CourseCatalogView.as_view(), name='student_course_catalog'),
    path('experience/catalog/<str:course_id>/', CourseDetailView.as_view(), name='student_course_detail'),
    path('experience/catalog/<str:course_id>/enroll/', CourseEnrollmentView.as_view(), name='student_course_enroll'),
    path('experience/lessons/<str:lesson_id>/', LessonPlaybackView.as_view(), name='student_lesson_playback'),
    path('experience/lessons/<str:lesson_id>/progress/', LessonProgressView.as_view(), name='student_lesson_progress'),
    path('experience/lessons/<str:lesson_id>/comments/', LessonCommentListCreateView.as_view(), name='student_lesson_comments'),
    path('experience/comments/<int:comment_id>/like/', LessonCommentLikeView.as_view(), name='student_lesson_comment_like'),
    path('experience/progression/summary/', StudentProgressSummaryView.as_view(), name='student_progress_summary'),
    path('experience/coding/challenges/', CodingChallengeListView.as_view(), name='student_coding_challenge_list'),
    path('experience/coding/challenges/<slug:slug>/', CodingChallengeDetailView.as_view(), name='student_coding_challenge_detail'),
    path('experience/coding/challenges/<slug:slug>/autosave/', CodingChallengeAutosaveView.as_view(), name='student_coding_challenge_autosave'),
    path('experience/coding/challenges/<slug:slug>/reset/', CodingChallengeResetView.as_view(), name='student_coding_challenge_reset'),
    path('experience/coding/challenges/<slug:slug>/run/', CodingChallengeRunView.as_view(), name='student_coding_challenge_run'),
    path('experience/coding/challenges/<slug:slug>/submit/', CodingChallengeSubmitView.as_view(), name='student_coding_challenge_submit'),
    path('experience/coding/challenges/<slug:slug>/hint/', CodingChallengeHintView.as_view(), name='student_coding_challenge_hint'),
    path('experience/projects/', StudentProjectListCreateView.as_view(), name='student_projects'),
    path('experience/projects/<uuid:project_id>/', StudentProjectDetailView.as_view(), name='student_project_detail'),
    path('experience/projects/<uuid:project_id>/publish/', StudentProjectPublishView.as_view(), name='student_project_publish'),
    path('experience/projects/<uuid:project_id>/validate/', StudentProjectValidateView.as_view(), name='student_project_validate'),

]
