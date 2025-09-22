from django.urls import path
from .views import BranchesView, CodeUpdateView, AskQuestionView, LessonMetadataView, llm_playround

app_name = "llm_tutor"

urlpatterns = [
    path('api/llm/update', CodeUpdateView.as_view(), name='code-update'),
    path('api/llm/ask', AskQuestionView.as_view(), name='ask-question'),
    path('api/lesson/<str:lesson_id>', LessonMetadataView.as_view(), name='lesson-metadata'),
    path('api/branches/<str:lesson_id>/', BranchesView.as_view(), name='branches'),
    path('llm-playground/', llm_playround, name='llm_playround'),
]