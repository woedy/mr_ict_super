# Mr ICT Backend Overview

This document captures the backend architecture, core workflows, integrations, and operating assumptions for the Mr ICT platform. It serves as a single source of truth to guide development, testing, and deployment.

## Product Context

Mr ICT is an interactive coding education platform inspired by Scrimba, tailored for Ghanaian students. It combines:
 - Interactive lessons with time-synced video + editor snapshots for replayable, step-by-step learning
 - Live, in-browser coding exercises and assignments
 - An AI tutor (RAG + local LLM) that uses the official curriculum to give step-aware guidance
 - School, student, and course management with dashboards and notifications
 - Admin-only lesson recording; students consume published lessons (Scrimba-style)

## Tech Stack

- Framework: Django 5 + Django REST Framework
- Realtime: Django Channels (Redis backend configured), ASGI via Daphne
- Background tasks: Celery (Redis broker)
- Auth: Custom user model (`accounts.User`), DRF Token and SimpleJWT both present (to be unified)
- Storage: Local filesystem for media by default (configurable)
- Database: SQLite by default; Postgres configurable via env
- CORS: `django-cors-headers`
- LLM & RAG: `sentence-transformers` + FAISS index for curriculum retrieval; local LLM endpoint (e.g., Ollama) at `http://localhost:11434`

Key dependencies listed in `requirements.txt`.

## High-Level Architecture

- API surface at `/api/...` (REST)
  - Accounts, courses, schools, students, teachers, notifications, video_tutorials, and llm_tutor apps
- Channels and ASGI configured for future websocket features
- Celery configured for background tasks (jobs not yet centralized) 
- LLM Tutor endpoints under `/llm-tutor/api/...` consume a local LLM and RAG retriever
- Video recording pipeline converts uploaded screen recordings, stores playable media, and persists code snapshots with timestamps

## Major Apps & Responsibilities

- `accounts`: Custom user model, registration/login flows, OTP/email verification helpers, token issuance
- `courses`: Courses and lessons (video, snippets, inserts); lesson ordering and metadata
- `llm_tutor`: Lesson/step models (tutor side), RAG retriever (FAISS + sentence-transformers), tutor endpoints for code updates and Q&A
- `video_tutorials`: Recording model and bulk code snapshots; endpoints to upload videos, save snapshots, and manage per-project files for a simple HTML/CSS/JS workspace
  - Recording and upload endpoints should be admin-protected; student APIs are read-only for published content
- `notifications`: Simple notification listing/mark-read
- `homepage`, `students`, `teachers`, `schools`, `activities`, `mr_admin`: domain scaffolding and endpoints for dashboards/admin flows

## Data Model Snapshot (selected)

- `accounts.User`: email login, optional profile fields, `user_id` as public ID, token on create
- `courses.Course` and `courses.Lesson`: ordered lessons, media attachments; auto-generated public IDs
- `llm_tutor.Lesson` and `llm_tutor.LessonStep`: curriculum representation for tutor flows; step-level expected code and timings
- `llm_tutor.CodeSnapshot`: per-user, per-step code interactions with timestamps and optional branch IDs
- `video_tutorials.Recording` and `CodeSnapshotRecording`: uploaded screen recordings and batched code snapshots (title-keyed, linked post-upload)
- `video_tutorials.Project` and `ProjectFile`: small HTML/CSS/JS project workspace

Note: There is duplication between `courses.Lesson` and `llm_tutor.Lesson`; and between `projects` vs `video_tutorials.Project`. Unification/explicit linking is recommended.

## Core Workflows

1) Recording + Code Snapshots (Admin)
- Admin records screen + mic (webm) and posts to `POST /api/upload/`
- Admin editor batches snapshots to `POST /api/save-code-snapshots/` (title + [{code, cursor, scroll, timestamp}])
- Backend stores media (optional ffmpeg transcode), persists snapshots, and links snapshots to the recording (by title or ID)
- Publishing: mark a recording as published when ready (flag/endpoint)
- Student playback: `GET /api/recordings/` (published only) and `GET /api/recordings/<id>/` return video URL and ordered snapshots for the player

2) Interactive Lessons + Tutor
- Lessons comprise steps with descriptions, expected code, and assignment flags
- Student edits code; frontend calls `POST /llm-tutor/api/llm/update` with lesson_id and step
- Backend diffs user code vs. expected, retrieves curriculum context via FAISS, and prompts a local LLM to provide step-aware guidance
- Tutor also answers questions at `POST /llm-tutor/api/llm/ask`

3) Courses and Progress
- Course listing, lesson details, attachments/media
- Student dashboards and lesson resumes (frontend UI present; backend endpoints to be aligned/expanded)

## Configuration & Environment

Environment variables (key examples):
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`
- Email: `DJANGO_EMAIL_*`, `DJANGO_DEFAULT_FROM_EMAIL`
- Database: `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- Celery/Channels: `CELERY_BROKER_URL` (defaults to `redis://localhost:6379/0`)
- CORS: `CORS_ALLOWED_ORIGINS` (prod); debug defaults permissive
- Media/Static: `STATIC_ROOT`, `MEDIA_ROOT`
- LLM: should be parameterized (currently hardcoded in code as `http://localhost:11434` and model name)

Recommendations:
- Split dev/prod settings or use env toggles to avoid always-on permissive CORS
- Parameterize LLM host/model, ffmpeg behavior, and Redis host for Channels/Celery
 - Add a `published` flag on `Recording` and enforce role-based access: Admin can upload/manage, Students can only read published content

## Security & Auth

- DRF settings default to SimpleJWT auth but DEBUG path sets `AllowAny` globally; several views use TokenAuth explicitly
- Goal: standardize to a single scheme (prefer SimpleJWT) and ensure frontend sends the same token everywhere
- Enforce CSRF rules for session-based flows if used; otherwise, CORS + JWT

## LLM & RAG Details

- Index builder: `llm_tutor/curriculum/index_curriculum.py` builds FAISS over curriculum JSON files into `data/vectors/`
- Retriever: `llm_tutor/tutor/rag.py` loads FAISS and metadata, retrieves top-k contexts, caches results, then `views.py` composes prompts for the local LLM
- Ensure the model name and endpoint are configurable and the index build is part of your setup scripts

## Deployment Notes

- ASGI app configured via `core/asgi.py` (Daphne)
- Channels Redis host currently set to `redis` in settings; align with your runtime (Docker vs local)
- Celery worker + beat recommended for background tasks (transcoding, indexing, notifications)
- Heavy deps (FAISS, sentence-transformers) require appropriate base images and build steps
- Media persistence and static collection workflows vary by environment (consider S3-compatible storage in prod)

## Ghana Context Considerations

- Bandwidth: prefer webm or efficient codecs; offer lower resolutions
- Offline/limited connectivity: prefetch assets, consider service-worker caching (frontend)
- Localization: English-first with potential Twi/Ewe; keep tutor explanations concise and age-appropriate
- Accessibility: captions/subtitles, keyboard navigation, color contrast

## Known Gaps / Risks

- Mixed authentication approaches (SimpleJWT vs Token) and permissive DRF defaults under DEBUG
- CORS settings duplicated with forced allow-all; fix to env-driven in prod
- OS-specific ffmpeg path assumptions; migrate to `MEDIA_ROOT`-based paths
- Duplicate domains (lessons/projects) and placeholder Channels/Celery usage
- Hardcoded LLM endpoint/model names

## Dev Quickstart (indicative)

1) Create and activate a virtualenv; install `requirements.txt`
2) `python manage.py migrate && python manage.py createsuperuser`
3) Run Redis, then `python manage.py runserver` (backend) and start Celery worker if needed
4) Build the FAISS index (one-off), then start the local LLM server (e.g., Ollama)
5) Start the React frontend against the backend base URL

Keep this overview updated as features evolve and deployments harden.
