# AGENTS.md

This document coordinates the staged delivery of Mr ICT across the admin, backend, and student apps. Follow the checklist in order. When a task is completed, replace the `[ ]` with `[x]`, add a short dated note under the task describing what changed, and commit the update alongside code changes.

## Working Agreement
- Keep this file in sync with reality—update scope notes as soon as decisions change.
- Each task describes *how* we expect to implement the work. Treat the subtasks as acceptance criteria.
- Favor vertical slices that land backend + frontend + infrastructure together for a coherent increment.
- Always run and document repo-specific checks noted inside future AGENTS.md files when touching code in that subtree.
- Defer LLM/tutor feature work (and associated heavy dependencies) until we explicitly revisit Phase 4; concentrate on non-LLM
  deliverables for now to avoid large installs like `sentence_transformers`.
- Treat LLM/tutor backlog items as strictly out of scope until the Scrimba-style core learning experience (through Phase 3)
  ships; we only resume LLM efforts once those "standard" features are complete.

## Task Backlog

### [x] 1. Platform Foundations & Environment Hardening
_2025-09-22_: Docker Compose stack, env-driven Django settings, JWT issuance/refresh across backend + both React apps, axios clients, and onboarding docs landed.
**Goal:** create consistent, secure environments across backend and both React apps.
- **Configuration & Secrets**
  - Convert Django settings to environment-driven config with `.env` templates for local/dev/prod.
  - Wire up CORS, CSRF, logging, and storage backends via settings modules and env vars.
  - Add Docker Compose services (Postgres, Redis, MinIO/S3-compatible storage, Celery worker) with documentation.
- **Authentication Alignment**
  - Adopt SimpleJWT (or the chosen JWT provider) in Django; remove competing auth schemes.
  - Centralize axios/fetch clients in both frontends to read base URLs and tokens from env vars; ensure refresh + logout flows.
  - Define role/permission matrix (admin, tutor, student, school staff) and expose it via backend claims and frontend guards.
- **Developer Experience**
  - Add make/Invoke scripts for common workflows, prettier/eslint configs aligned across apps, and update README quick-starts.
  - Ensure lint/test Git hooks or CI config exist so future tasks inherit a reliable foundation.

### [x] 2. Admin Content Production Pipeline
_2025-09-22_: Added publishable course/module/lesson models with audit logging, DRF admin endpoints, review/publish validation tests, and React admin flows for course dashboards and detail management.
**Goal:** enable admins to author, review, and publish courses/lessons.
- **Backend Models & APIs**
  - Design course/module/lesson schemas with draft & publish states, media references, tagging, and ownership metadata.
  - Provide CRUD endpoints plus filtering/search for admin dashboards.
  - Add recording upload endpoints (video + metadata + snapshots) with validation and storage integration.
- **Admin UI**
  - Build TailAdmin-based pages for course list, detail editor, module/lesson management, and media upload/review.
  - Surface publish workflow (draft, needs review, published) with permission checks.
  - Include audit trails (history/log display) and announcement management.
- **Quality Gates**
  - Implement server-side publish checks (required fields, validated media) and UI warnings.
  - Cover API serializers/views with tests; add frontend e2e or component tests for critical flows.

### [x] 3. Student Learning Experience
_2025-09-24_: Delivered student onboarding profile capture, dashboard, catalog, enrollment, and lesson playback APIs plus React flows with offline-aware caching and JWT protection.
**Goal:** deliver the core learner journey from onboarding to lesson consumption.
- **Auth & Onboarding**
  - Build signup/login/reset/OTP flows connected to the unified auth backend.
  - Implement first-time profile setup and preference capture (language, accessibility, interests).
- **Dashboard & Catalog**
  - Create home dashboard showing enrolled courses, progress, streaks, and recommendations.
  - Build searchable/browsable course catalog with enrollment actions and access controls.
- **Lesson Playback**
  - Integrate video player with transcript/notes, attachments, and progress persistence.
  - Add offline/error handling (retry, download options, service worker caching for key assets).

### [x] 4. Interactive Coding, Tutor, and Projects
_2025-09-25_: Added Python run-code service with structured test cases, student coding state APIs, Monaco-based sandbox UI with hints/diffing, and student project workspace CRUD + validation across backend and frontend.
_2025-09-26_: Hardened the coding sandbox sanitisation to block path traversal, excessive file uploads, and unsafe entrypoints.
**Goal:** ship the Monaco-based coding + AI tutor experiences and project workspaces.
- **Coding Sandbox**
  - Wire Monaco editors to backend run-code service; support starter files, autosave, reset, and diff view.
  - Provide UI for hints/solutions with rate limiting and offline fallback messaging.
- **Tutor Integration**
  - Finalize tutor curriculum schema, FAISS/RAG pipelines, and guardrails; expose lesson-aware assistance endpoints.
  - Surface tutor chat UI with context breadcrumbs, conversation history, and feedback capture.
- **Projects Workspace**
  - Deliver CRUD for student projects/challenges (HTML/CSS/JS bundles) including tests against hidden cases.
  - Add plagiarism detection hooks for backlog and admin review queues.

### [x] 5. Assessments, Progression, and Engagement
_2025-09-27_: Added assessment grading APIs with XP/badge/certificate rewards, student progress summaries, announcements, and lesson discussions plus learner UI and tests.
**Goal:** motivate learners and validate learning.
- **Assessments**
  - Implement quiz/question bank models, assembly rules, attempt tracking, grading, and review UI.
  - Offer practice modes with filters (difficulty, topic) and timed challenges.
- **Progress Systems**
  - Add XP/badge/certificate models, issuing logic, and dashboard galleries (student + admin views).
  - Provide downloadable certificates and shareable summaries.
- **Engagement Features**
  - Build announcements, comments, reactions, leaderboards, and notification preferences (email/SMS/in-app).
  - Ensure moderation tooling and rate limiting to protect communities.

### [x] 6. Analytics, Background Jobs, and Operations
_2025-09-28_: Added analytics event logging with daily summaries, Celery beat scheduling, admin dashboards fed by reporting APIs, frontend telemetry hooks, and system health monitoring.
_2025-09-29_: Added historical backfill tooling, Flower monitoring via Docker Compose, and documentation for operating the analytics pipeline.
**Goal:** support data-driven decisions and reliable operations.
- **Analytics Pipeline**
  - Instrument event tracking (frontend + backend), persist aggregates, and expose reporting APIs.
  - Create analytics dashboards and CSV export tools for schools/admins.
- **Background Processing**
  - Configure Celery/Redis workers for transcoding, tutor indexing, notifications, and scheduled maintenance.
  - Add monitoring (health checks, metrics, alerting hooks) across services.
- **Media & Deployment**
  - Optimize ffmpeg pipelines, generate multi-resolution outputs, manage storage lifecycles.
  - Document deployment strategy (staging/prod), including migrations, backup/restore, and bandwidth-aware CDN choices.

Keep iterating on this backlog as the product evolves; new insights should append rather than overwrite history.
