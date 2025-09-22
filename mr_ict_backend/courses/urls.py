from django.urls import path

from courses.views.challenge_badge_view import add_lesson_badge_view, archive_lesson_badge, delete_lesson_badge, get_all_archived_lesson_badge_view, get_all_lesson_badges_view, get_lesson_badge_details_view, unarchive_lesson_badge
from courses.views.coding_challenge_views import add_coding_challenge_view, archive_coding_challenge, delete_coding_challenge, get_all_archived_coding_challenges_view, get_all_coding_challenges_view, get_coding_challenge_details_view, unarchive_coding_challenge
from courses.views.course_views import add_course_view, archive_course, delete_course, edit_course, get_all_archived_courses_view, get_all_courses_view, get_course_details_view, unarchive_course
from courses.views.lesson_assignment_views import add_lesson_assignment_view, archive_lesson_assignment, delete_lesson_assignment, get_all_archived_lesson_assignment_view, get_all_lesson_assignments_view, get_lesson_assignment_details_view, unarchive_lesson_assignment
from courses.views.lesson_code_snippet_views import add_lesson_code_snippet_view, archive_lesson_code_snippet, delete_lesson_code_snippet, get_all_archived_lesson_code_snippet_view, get_all_lesson_code_snippets_view, get_lesson_code_snippet_details_view, unarchive_lesson_code_snippet
from courses.views.lesson_insert_output_views import add_lesson_insert_output_view, archive_lesson_insert_output, delete_lesson_insert_output, get_all_archived_lesson_insert_output_view, get_all_lesson_insert_outputs_view, get_lesson_insert_output_details_view, unarchive_lesson_insert_output
from courses.views.lesson_insert_video_views import add_lesson_insert_video_view, archive_lesson_insert_video, delete_lesson_insert_video, get_all_archived_lesson_insert_video_view, get_all_lesson_insert_videos_view, get_lesson_insert_video_details_view, unarchive_lesson_insert_video
from courses.views.lesson_intro_video_views import add_lesson_intro_video_view, archive_lesson_intro_video, delete_lesson_intro_video, get_all_archived_lesson_intro_video_view, get_all_lesson_intro_videos_view, get_lesson_intro_video_details_view, unarchive_lesson_intro_video
from courses.views.lesson_video_views import add_lesson_video_view, archive_lesson_video, delete_lesson_video, get_all_archived_lesson_video_view, get_all_lesson_videos_view, get_lesson_video_details_view, unarchive_lesson_video
from courses.views.lesson_views import add_lesson_view, archive_lesson, delete_lesson, edit_lesson, get_all_archived_lessons_view, get_all_lessons_view, get_lesson_details_view, unarchive_lesson
from homepage.views.student_views import get_student_homepage_data_view


app_name = 'courses'

urlpatterns = [
    ## COURSES

    path('add-course/', add_course_view, name="add_course_view"),
    path('get-all-courses/', get_all_courses_view, name="get_all_courses_view"),
    path('edit-course/', edit_course, name="edit_course_view"),
    path('get-course-details/', get_course_details_view, name="get_course_detail_view"),
    path('archive-course/', archive_course, name="archive_course"),
    path('unarchive-course/', unarchive_course, name="unarchive_course"),
    path('get-all-archived-course/', get_all_archived_courses_view, name="get_all_archived_course_view"),
    path('delete-course/', delete_course, name="delete_course"),
    
    ## LESSONS
    
    path('add-lesson/', add_lesson_view, name="add_lesson_view"),
    path('get-all-lessons/', get_all_lessons_view, name="get_all_lessons_view"),
    path('edit-lesson/', edit_lesson, name="edit_lesson_view"),
    path('get-lesson-details/', get_lesson_details_view, name="get_lesson_detail_view"),
    path('archive-lesson/', archive_lesson, name="archive_lesson"),
    path('unarchive-lesson/', unarchive_lesson, name="unarchive_lesson"),
    path('get-all-archived-lesson/', get_all_archived_lessons_view, name="get_all_archived_lesson_view"),
    path('delete-lesson/', delete_lesson, name="delete_lesson"),

    path('add-lesson-intro-video/', add_lesson_intro_video_view, name="add_lesson_intro_video_view"),
    path('get-all-lesson-intro-video/', get_all_lesson_intro_videos_view, name="get_all_lesson_intro_videos_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_intro_video_view"),
    path('get-lesson-intro-video-details/', get_lesson_intro_video_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-intro-video/', archive_lesson_intro_video, name="archive_lesson"),
    path('unarchive-lesson-intro-video/', unarchive_lesson_intro_video, name="unarchive_lesson"),
    path('get-all-archived-lesson-intro-video/', get_all_archived_lesson_intro_video_view, name="get_all_archived_lesson_intro_video_view"),
    path('delete-lesson-intro-video/', delete_lesson_intro_video, name="delete_lesson_intro_video"),
    
    path('add-lesson-insert-video/', add_lesson_insert_video_view, name="add_lesson_insert_video_view"),
    path('get-all-lesson-insert-video/', get_all_lesson_insert_videos_view, name="get_all_lesson_insert_videos_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_insert_video_view"),
    path('get-lesson-insert-video-details/', get_lesson_insert_video_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-insert-video/', archive_lesson_insert_video, name="archive_lesson"),
    path('unarchive-lesson-insert-video/', unarchive_lesson_insert_video, name="unarchive_lesson"),
    path('get-all-archived-lesson-insert-video/', get_all_archived_lesson_insert_video_view, name="get_all_archived_lesson_insert_video_view"),
    path('delete-lesson-insert-video/', delete_lesson_insert_video, name="delete_lesson_insert_video"),
    
    path('add-lesson-insert-output/', add_lesson_insert_output_view, name="add_lesson_insert_output_view"),
    path('get-all-lesson-insert-output/', get_all_lesson_insert_outputs_view, name="get_all_lesson_insert_outputs_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_insert_output_view"),
    path('get-lesson-insert-output-details/', get_lesson_insert_output_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-insert-output/', archive_lesson_insert_output, name="archive_lesson"),
    path('unarchive-lesson-insert-output/', unarchive_lesson_insert_output, name="unarchive_lesson"),
    path('get-all-archived-lesson-insert-output/', get_all_archived_lesson_insert_output_view, name="get_all_archived_lesson_insert_output_view"),
    path('delete-lesson-insert-output/', delete_lesson_insert_output, name="delete_lesson_insert_output"),
    
    path('add-lesson-video/', add_lesson_video_view, name="add_lesson_video_view"),
    path('get-all-lesson-video/', get_all_lesson_videos_view, name="get_all_lesson_videos_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_video_view"),
    path('get-lesson-video-details/', get_lesson_video_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-video/', archive_lesson_video, name="archive_lesson"),
    path('unarchive-lesson-video/', unarchive_lesson_video, name="unarchive_lesson"),
    path('get-all-archived-lesson-video/', get_all_archived_lesson_video_view, name="get_all_archived_lesson_video_view"),
    path('delete-lesson-video/', delete_lesson_video, name="delete_lesson_video"),
    


    path('add-lesson-code-snippet/', add_lesson_code_snippet_view, name="add_lesson_code_snippet_view"),
    path('get-all-lesson-code-snippet/', get_all_lesson_code_snippets_view, name="get_all_lesson_code_snippets_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_code_snippet_view"),
    path('get-lesson-code-snippet-details/', get_lesson_code_snippet_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-code-snippet/', archive_lesson_code_snippet, name="archive_lesson"),
    path('unarchive-lesson-code-snippet/', unarchive_lesson_code_snippet, name="unarchive_lesson"),
    path('get-all-archived-lesson-code-snippet/', get_all_archived_lesson_code_snippet_view, name="get_all_archived_lesson_code_snippet_view"),
    path('delete-lesson-code-snippet/', delete_lesson_code_snippet, name="delete_lesson_code_snippet"),
    

    path('add-lesson-assignment/', add_lesson_assignment_view, name="add_lesson_assignment_view"),
    path('get-all-lesson-assignment/', get_all_lesson_assignments_view, name="get_all_lesson_assignments_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_assignment_view"),
    path('get-lesson-assignment-details/', get_lesson_assignment_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-assignment/', archive_lesson_assignment, name="archive_lesson"),
    path('unarchive-lesson-assignment/', unarchive_lesson_assignment, name="unarchive_lesson"),
    path('get-all-archived-lesson-assignment/', get_all_archived_lesson_assignment_view, name="get_all_archived_lesson_assignment_view"),
    path('delete-lesson-assignment/', delete_lesson_assignment, name="delete_lesson_assignment"),
    


        path('add-coding-challenge/', add_coding_challenge_view, name="add_coding_challenge_view"),
    path('get-all-coding-challenges/', get_all_coding_challenges_view, name="get_all_coding_challenges_view"),
    #path('edit-coding-challenge/', edit_coding_challenge, name="edit_coding_challenge_view"),
    path('get-coding-challenge-details/', get_coding_challenge_details_view, name="get_coding_challenge_detail_view"),
    path('archive-coding-challenge/', archive_coding_challenge, name="archive_coding_challenge"),
    path('unarchive-coding-challenge/', unarchive_coding_challenge, name="unarchive_coding_challenge"),
    path('get-all-archived-coding-challenge/', get_all_archived_coding_challenges_view, name="get_all_archived_coding_challenge_view"),
    path('delete-coding-challenge/', delete_coding_challenge, name="delete_coding_challenge"),


    path('add-lesson-badge/', add_lesson_badge_view, name="add_lesson_badge_view"),
    path('get-all-lesson-badge/', get_all_lesson_badges_view, name="get_all_lesson_badges_view"),
    #path('edit-lesson/', edit_lesson, name="edit_lesson_badge_view"),
    path('get-lesson-badge-details/', get_lesson_badge_details_view, name="get_lesson_detail_view"),
    path('archive-lesson-badge/', archive_lesson_badge, name="archive_lesson"),
    path('unarchive-lesson-badge/', unarchive_lesson_badge, name="unarchive_lesson"),
    path('get-all-archived-lesson-badge/', get_all_archived_lesson_badge_view, name="get_all_archived_lesson_badge_view"),
    path('delete-lesson-badge/', delete_lesson_badge, name="delete_lesson_badge"),
    

    #path('course-info/', get_course_info_view, name="get_course_info_view"),
    #path('course-info/', get_interactive_coding_view, name="interactive_codding_view"),

]
