# Test Case: Admin Course Production Workflow

## User Story
As an admin content creator, I need to draft, review, and publish a course with modules and lessons so that Ghanaian students can access curated programming content through the learner app.

## Preconditions
- Admin account exists with publish permissions.
- Platform stack is running locally with Docker Compose or equivalent services.
- Sample lesson media (video file, thumbnail, transcript) available for upload.

## Test Steps
1. Sign in to the admin console at `http://localhost:5174` using admin credentials.
2. Navigate to the Courses section and click “Create Course”. Provide title, slug, description, target audience, and ownership metadata.
3. Add at least one module and populate it with multiple lessons, ensuring each lesson has required metadata (duration, prerequisites) and uploaded media assets (video, attachments, snapshots).
4. Attempt to publish the course while a required field is intentionally left blank to verify validation messaging.
5. Complete missing fields, attach audit notes, and progress the course through Draft → Needs Review → Published, confirming status changes and history entries.
6. Visit the course detail dashboard to ensure modules/lessons render correctly, media previews load via MinIO URLs, and audit history logs actions with timestamps and actor info.

## Acceptance Criteria
- Draft creation succeeds and surfaces inline validation errors for missing required metadata without leaving the page.
- Upload endpoints accept lesson media, returning stored URLs and snapshot thumbnails visible in the detail view.
- Publish attempt with invalid data is blocked and surfaces actionable error messages tied to specific fields.
- Course status transitions update in both backend (via API response) and frontend UI, with audit log entries capturing each transition.
- Published course appears in the admin course list with correct status badge and is visible to the student catalog API.

## Notes
- Validate that request payloads include JWT `Authorization` headers and request IDs for traceability in backend logs.
- Confirm MinIO credentials from `.env` are respected and that uploads fail gracefully if storage is unreachable.
