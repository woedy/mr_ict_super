from django.urls import path

from schools.views import add_school_view, archive_school, delete_school, edit_school, get_all_archived_schools_view, get_all_schools_view, get_school_details_view, unarchive_school



app_name = 'schools'

urlpatterns = [
    path('add-school/', add_school_view, name="add_school_view"),
    path('get-all-schools/', get_all_schools_view, name="get_all_schools_view"),
    path('edit-school/', edit_school, name="edit_school_view"),
    path('get-school-details/', get_school_details_view, name="get_school_detail_view"),
    path('archive-school/', archive_school, name="archive_school"),
    path('unarchive-school/', unarchive_school, name="unarchive_school"),
    path('get-all-archived-schools/', get_all_archived_schools_view, name="get_all_archived_school_view"),
    path('delete-school/', delete_school, name="delete_school"),

]
