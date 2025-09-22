# Mr ICT Backend Checklist

Use this checklist to plan, implement, and track backend work. Items are grouped by capability area. Check off as completed.

## Platform Setup
- [ ] Environment-driven settings (prod/dev split, secrets, allowed hosts)
- [ ] CORS hardened (env-based; no unconditional allow-all)
- [ ] Logging/observability baseline (request logs, errors)
- [ ] Docker/Docker Compose (web, redis, worker)

## Authentication & Users
- [ ] Choose and standardize auth scheme (SimpleJWT preferred)
- [ ] Login, signup, logout endpoints
- [ ] Email OTP verification endpoints
- [ ] Password reset and change flows
- [ ] Roles/permissions (student, teacher, admin)
- [ ] Profile CRUD and avatar uploads

## Courses, Modules, Lessons
- [ ] Course CRUD (status: draft/published)
- [ ] Module structure (course → modules → lessons)
- [ ] Lesson CRUD with media/attachments
- [ ] Lesson progress events (start, complete)
- [ ] Resume last lesson API

## Interactive Coding & Projects
- [ ] Lesson starter code + auto-save drafts per user
- [ ] Code execution API (JS sandbox first; others later)
- [ ] Challenge definitions with test cases
- [ ] Project workspace APIs (HTML/CSS/JS)
- [ ] Plagiarism/duplicate submission checks (phase 2)

## Recording & Playback
- [ ] Admin-only protection for upload and snapshot ingestion endpoints
- [ ] Video upload endpoint (accept webm; ffmpeg configurable)
- [ ] Bulk code snapshot ingestion
- [ ] Recording ↔ snapshot linking
- [ ] Publish flag and endpoint for recordings
- [ ] Student playback APIs: list published recordings; details with ordered snapshots
- [ ] Security: upload limits and validation

## LLM Tutor (RAG)
- [ ] Curriculum JSON format finalized
- [ ] FAISS index build command and storage
- [ ] Retrieval service (k, caching, errors)
- [ ] Tutor endpoints: code update and Q&A
- [ ] LLM endpoint/model config via env
- [ ] Guardrails: hints before solutions, assignment integrity

## Quizzes & Assessments
- [ ] Question bank models (MCQ, etc.)
- [ ] Quiz assembly and submission APIs
- [ ] Scoring and feedback rules
- [ ] Attempt history and retake limits
- [ ] Item analysis endpoints (admin)

## Progress, XP, Rewards, Certificates
- [ ] XP award rules and levels
- [ ] Badge issuance
- [ ] Course completion records
- [ ] Certificate issuance and PDF generation

## Notifications & Messaging
- [ ] In-app notifications: create, list, mark-read
- [ ] Email/sms provider integration
- [ ] Announcements broadcast APIs

## Admin & Moderation
- [ ] Admin auth and session management
- [ ] Role-based permissions enforcement
- [ ] Course/content moderation endpoints
- [ ] Audit logs for sensitive actions

## Analytics & Reporting
- [ ] Event tracking pipeline (lesson views, code runs, hints)
- [ ] Aggregates for dashboards (retention, funnels, completion)
- [ ] Exportable reports (schools/partners)

## Background Jobs & System Tasks
- [ ] Celery worker/beat setup
- [ ] Transcoding/indexing jobs
- [ ] Cache invalidation and reindex tasks
- [ ] Periodic data maintenance

## Deployment & Ops
- [ ] Environment secrets management
- [ ] Static/media storage (S3-compatible in prod)
- [ ] Health checks (web, worker, LLM, Redis)
- [ ] Error monitoring and alerting

