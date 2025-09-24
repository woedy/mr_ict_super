# Test Case: Student Onboarding, Dashboard, and Catalog Navigation

## User Story
As a newly registered student, I want to complete onboarding, view my personalized dashboard, and browse the course catalog so that I can start learning and resume lessons seamlessly even with intermittent connectivity.

## Preconditions
- Student account exists without completed onboarding preferences.
- At least one published course with modules/lessons is available.
- Service worker/offline caching is enabled in the learner app build.

## Test Steps
1. Log into the learner app at `http://localhost:5173` with a student account flagged as requiring onboarding.
2. Complete the onboarding form, providing language preference, accessibility settings, and interests; submit and verify the dashboard loads afterward.
3. Disconnect network connectivity (simulate offline) and refresh the dashboard to confirm cached data renders with an offline indicator.
4. Reconnect network and navigate to the course catalog; search for the published course created in the admin workflow and enroll if not already enrolled.
5. Open the lesson list for the enrolled course, select a lesson, and confirm progress state and resume data are persisted.
6. Inspect API responses to ensure JWT tokens are included and that axios retries/resumes after a forced 500 error.

## Acceptance Criteria
- Onboarding form enforces required fields, saves preferences via the students API, and redirects to the dashboard only on success.
- Dashboard shows enrolled courses, progress stats, badges, and resume-learning card populated from the normalized API payload.
- Offline mode displays cached dashboard data without crashing and surfaces a banner or toast about connectivity loss.
- Catalog search returns courses respecting publish status, and enrollment updates the dashboard resume list within the same session.
- Lesson viewer resumes playback or coding state from the persisted progress and records new progress events for analytics.

## Notes
- Validate that analytics events fire when lessons start and that failures do not block the primary lesson playback flow.
- Capture logs verifying request IDs propagate through onboarding, dashboard, and catalog API calls.
