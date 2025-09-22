from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import difflib
import requests
import uuid
from datetime import datetime
from django.contrib.auth import get_user_model

from llm_tutor.tutor.rag import RAGRetriever
from .models import Lesson, LessonStep, CodeSnapshot

rag_retriever = None


def get_rag():
    global rag_retriever
    if rag_retriever is None:
        rag_retriever = RAGRetriever()
    return rag_retriever

User = get_user_model()

class CodeUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_id = request.data.get('lesson_id')
        step_number = request.data.get('step')
        user_code = request.data.get('code')

        lesson = Lesson.objects.get(lesson_id=lesson_id)
        step = LessonStep.objects.get(lesson=lesson, step_number=step_number)
        expected_code = step.expected_code

        # Detect differences
        diff = difflib.Differ().compare(expected_code.splitlines(), user_code.splitlines())
        is_different = any(line.startswith(('+', '-')) for line in diff)

        # Save code snapshot
        snapshot = CodeSnapshot.objects.create(
            user=user,
            lesson=lesson,
            step=step,
            code=user_code,
            branch_id=str(uuid.uuid4()) if is_different else None,
            interaction_start=datetime.now()
        )

        # Retrieve curriculum content
        query = f"{lesson.title} step {step_number} {user_code}"
        curriculum_docs = get_rag().retrieve(query, k=2)
        context = "\n".join(curriculum_docs)

        # Check if step is an assignment
        rag_meta = get_rag().metadata
        is_assignment = any(meta['assignment'] for meta in rag_meta if meta['lesson_id'] == lesson_id and meta['step_number'] == step_number)
        feedback = ""
        if is_assignment and is_different:
            feedback = "Your code differs from the expected solution. Ensure your <article> has a heading and paragraph as shown in the curriculum."
        elif is_assignment:
            feedback = "Great job! Your code matches the expected <article> structure."

        # Call local LLM
        start_time = datetime.now()
        try:
            llm_response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'llama3.2:3b',
                    'prompt': f"""
                    Curriculum Context: {context}
                    Lesson: {lesson.title}
                    Step: {step.description}
                    Expected Code: {expected_code}
                    User Code: {user_code}
                    Context: The user is learning Semantic HTML.
                    {'Explain the difference and guide the user based on the curriculum.' if is_different else 'Explain the current step using the curriculum.'}
                    Be concise and conversational, like a live tutor.
                    {f'Assignment Feedback: {feedback}' if is_assignment else ''}
                    """,
                    'stream': False
                }
            ).json()
            explanation = llm_response.get('response', 'No response from LLM.')
        except requests.RequestException:
            explanation = 'Error connecting to local LLM.'
        end_time = datetime.now()

        snapshot.interaction_end = end_time
        snapshot.save()

        return Response({
            'explanation': explanation,
            'branch_id': snapshot.branch_id,
            'interaction_duration': (end_time - start_time).total_seconds(),
            'assignment_feedback': feedback if is_assignment else None
        })

class AskQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_code = request.data.get('code')
        question = request.data.get('question')
        lesson_id = request.data.get('lesson_id')
        step_number = request.data.get('step')

        lesson = Lesson.objects.get(lesson_id=lesson_id)
        step = LessonStep.objects.get(lesson=lesson, step_number=step_number)

        # Retrieve curriculum content
        query = f"{lesson.title} step {step_number} {question}"
        curriculum_docs = get_rag().retrieve(query, k=2)
        context = "\n".join(curriculum_docs)


        user = request.user

        # Save interaction
        snapshot = CodeSnapshot.objects.create(
            user=user,
            lesson=lesson,
            step=step,
            code=user_code,
            interaction_start=datetime.now()
        )

        # Call local LLM
        start_time = datetime.now()
        try:
            llm_response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'llama3.2:3b',
                    'prompt': f"""
                    Curriculum Context: {context}
                    Lesson: {lesson.title}
                    Step: {step.description}
                    User Code: {user_code}
                    Question: {question}
                    Context: The user is learning Semantic HTML. Answer concisely and conversationally, using the curriculum.
                    """,
                    'stream': False
                }
            ).json()
            answer = llm_response.get('response', 'No response from LLM.')
        except requests.RequestException:
            answer = 'Error connecting to local LLM.'
        end_time = datetime.now()

        snapshot.interaction_end = end_time
        snapshot.save()

        return Response({
            'answer': answer,
            'interaction_duration': (end_time - start_time).total_seconds()
        })

class LessonMetadataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = Lesson.objects.get(lesson_id=lesson_id)
        steps = lesson.steps.all()
        total_duration = sum(step.estimated_duration for step in steps)
        return Response({
            'estimated_duration': total_duration,
            'steps': [{'step_number': step.step_number, 'description': step.description, 'expected_code': step.expected_code} for step in steps]
        })
    







class BranchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        user = request.user

        lesson = Lesson.objects.get(lesson_id=lesson_id)
        snapshots = CodeSnapshot.objects.filter(user=user, lesson=lesson, branch_id__isnull=False).order_by('-timestamp')
        return Response([{
            'branch_id': snapshot.branch_id,
            'code': snapshot.code,
            'step': {'step_number': snapshot.step.step_number},
            'timestamp': snapshot.timestamp.isoformat()
        } for snapshot in snapshots])
    









from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status



@api_view(['POST'])
def llm_playround(request):
    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        context = request.data.get('context', "")



        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)


        try:
            llm_response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'phi',
                    'prompt': f"""{context}""",
                    'stream': False
                }
            ).json()
            explanation = llm_response.get('response', 'No response from LLM.')
            print(explanation)
        except requests.RequestException:
            explanation = 'Error connecting to local LLM.'


        payload['message'] = "Successful"
        payload['data'] = explanation

    return Response(payload)


