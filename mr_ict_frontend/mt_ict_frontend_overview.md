# Mr ICT Frontend Overview

This document describes the frontend application’s structure, dependencies, routing, integration points, and conventions.

## Product Context

Web app for students and admins to learn, practice, and manage courses. Key experiences:
- Student dashboard, course browsing, and lesson playback
- Live coding (Monaco) with interactive tutor and assignments
- Admin-only lesson recording (screen + mic) with code snapshot capture (handled in the Admin app)
- Simple projects workspace (HTML/CSS/JS)

## Tech Stack

- React 18 with Vite
- Styling: Tailwind CSS + Chakra UI components
- State: local component state + Zustand (editor store)
- Editor: `@monaco-editor/react`
- Drag & Drop: `react-dnd` + `react-dnd-html5-backend`
- Charts/visuals: ApexCharts
- HTTP: `fetch` and `axios` (consider unifying)
- TTS: browser `SpeechSynthesis`

## Key Routes & Screens

Defined in `src/App.tsx`:
- Auth: Sign In, Sign Up, Verify Email
- Dashboard, Courses (AllCourses, Lessons, Challenges, MyCourses)
- Student playback: RecordedCourseLessons, RecordVideoPlayer
- LLM Tutor: `/llm-tutor` (Monaco + step navigation + tutor responses)
- GPT Editor: experimental timeline editor
- External code editor: simple project file CRUD

Note: The recording workflow (RecordLessonPage) is Admin-only and should reside in the Admin app; the student app should not expose recording UI.

## Configuration

`src/constants.tsx` holds environment constants:
- `baseUrl`, `baseUrlMedia`, `baseWsUrl`
- `userToken`, `userID`, and other items sourced from `localStorage`

Recommendations:
- Transition to Vite env variables (`import.meta.env.VITE_API_BASE_URL`) to avoid hardcoding URLs
- Standardize on one HTTP client (axios) with a preconfigured instance that injects auth headers

## Integrations (Backend)

- Auth: `POST /api/accounts/login-student/` (stores token, user info in localStorage)
- Dashboard: calls to `/api/dashboard/` (to be aligned server-side)
- LLM Tutor:
  - `GET /llm-tutor/api/lesson/<lesson_id>` for steps and estimates
  - `POST /llm-tutor/api/llm/update` on editor changes
  - `POST /llm-tutor/api/llm/ask` for questions
 - Recording & Playback:
  - Admin (recording in Admin app): `POST /api/upload/` (multipart), `POST /api/save-code-snapshots/` (batched), optional `POST /api/recordings/<id>/publish`
  - Student (playback in Student app): `GET /api/recordings/` (published only), `GET /api/recordings/<id>/` (details with ordered snapshots)
- Projects workspace:
  - `GET /api/projects/`, `POST /api/projects/create/`
  - `GET /api/project_files/by_project/?project=<id>`
  - `PATCH /api/project_files/<file_id>/` to update content

Ensure all API calls consistently attach the chosen auth token.

## Recording Workflow (Admin)

- Uses `MediaRecorder` to capture screen + mic (in Admin app)
- Batches code snapshots from Monaco (throttled/debounced) with cursor/scroll positions and timestamps
- Uploads video (webm) and the code snapshots (JSON) for server-side processing

## LLM Tutor Experience

- Monaco editor holds user code per step
- On change, sends current step + code to backend to:
  - Diff vs expected
  - Retrieve curriculum context via FAISS
  - Prompt local LLM; returns concise tutor explanation and assignment feedback if applicable
- Tutor Q&A uses similar context; optional TTS playback of responses

## UI/UX Considerations

- Low bandwidth: prefer lazy-loading media, preload only necessary assets
- Accessibility: keyboard navigation, high contrast, captions/subtitles
- Localization: keep strings organized for future i18n
- Offline: consider a service worker for caching lesson assets and steps

## Build & Run

- Install deps: `npm ci`
- Dev: `npm run dev` (Vite)
- Build: `npm run build`; Preview: `npm run preview`

Adopt `.env` files for API base and feature flags per environment.
