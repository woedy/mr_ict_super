# Test Case: Coding Sandbox Execution and Project Workspace Management

## User Story
As a student practicing interactive coding challenges, I want to edit starter files in the Monaco sandbox, run tests safely, and manage my personal project workspaces so that I can iterate on code without compromising the platform.

## Preconditions
- Student account with access to coding challenges and projects.
- Backend run-code service and Celery worker running.
- At least one coding challenge and one project template published for the student.

## Test Steps
1. Launch the learner app and open a coding challenge from the “Playground” or course lesson context.
2. Modify files in the Monaco editor, ensuring autosave captures changes and diff view highlights modifications versus starter code.
3. Click “Run Code” and confirm the backend executes tests, returning structured pass/fail results without exposing filesystem paths.
4. Attempt to upload a file with disallowed path traversal (e.g., `../secrets.py`) and verify it is rejected with a clear error.
5. Open the Projects workspace, create a new project from a template, edit files, and trigger validation to view hidden test results or feedback.
6. Simulate offline mode during editing to confirm the app queues saves locally and syncs once connection resumes.

## Acceptance Criteria
- Autosave persists code between page reloads and across devices via student coding state APIs.
- Run execution returns sanitized output, respecting file count/size limits, and surfaces hints or solutions according to rate limits.
- Unauthorized file paths or oversized uploads are blocked server-side and surfaced to the user without breaking the session.
- Project CRUD operations (create, rename, delete, submit) succeed and appear in the student progression data.
- Offline edits queue locally, display appropriate messaging, and eventually sync without data loss when back online.

## Notes
- Monitor backend logs to ensure request IDs and user identifiers are captured for each run to aid in debugging.
- Confirm plagiarism detection hooks (if stubbed) record necessary metadata even if enforcement is deferred.
