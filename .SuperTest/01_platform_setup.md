# Test Case: Platform Environment Setup and JWT Authentication Baseline

## User Story
As a developer onboarding to the Mr ICT platform, I need a reliable way to provision the local environment with Docker Compose and environment-driven settings so that I can run the backend, student, and admin apps with JWT authentication working end to end.

## Preconditions
- Repository cloned locally.
- Docker, Docker Compose, Python 3.11+, and Node 18+ installed.
- Example environment files available in each app directory.

## Test Steps
1. Copy the `.env.example` files for backend, student, and admin apps into `.env` files and adjust secrets if necessary.
2. Run `docker compose up --build` from the repo root and wait for all services (Postgres, Redis, MinIO, Django API, Celery worker/beat, learner UI, admin UI, Flower) to report healthy logs.
3. Visit `http://localhost:8000/health/` to confirm database, cache, and Celery connectivity.
4. From the student app at `http://localhost:5173`, submit login credentials for an existing student; intercept the network response to verify it returns JWT `access` and `refresh` tokens plus the legacy `token` mirror.
5. From the admin app at `http://localhost:5174`, sign in as an admin and confirm API requests include the `Authorization: Bearer <access>` header and retry automatically after transient 500 errors.

## Acceptance Criteria
- Docker Compose boots all services without container crashes, and the Flower dashboard is reachable at `http://localhost:5555`.
- The `/health/` endpoint returns HTTP 200 with all checks marked `ok`.
- Student login responses contain `access`, `refresh`, and `token` fields; a subsequent API call succeeds without manual token injection.
- Admin axios client retries a forced transient failure (e.g., simulated via devtools) and succeeds on the second attempt while preserving the original request ID in logs.
- No manual environment edits outside the `.env` files are required once Docker Compose is up.

## Notes
- If `sentence_transformers` installation is requested during backend dependency setup, skip it per the working agreement until LLM scope resumes.
