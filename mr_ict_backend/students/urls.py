from django.urls import path

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




]
