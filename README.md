# Mr ICT Super Repo

This repository aggregates the admin, learner, and backend applications that power the Mr ICT interactive coding platform. The first milestone focuses on consistent environment management, JWT authentication, and a Docker Compose workflow that mirrors production topology.

## Getting Started

### 1. Clone & Install
```bash
# install backend dependencies (virtualenv recommended)
pip install -r mr_ict_backend/requirements.txt

# install frontend/admin dependencies
npm install --prefix mr_ict_frontend
npm install --prefix mr_ict_admin
```

### 2. Configure Environment Variables
Copy the example files and adjust values for your machine. At minimum update `DJANGO_SECRET_KEY` and database credentials if you are not using Docker defaults.

```bash
cp mr_ict_backend/.env.example mr_ict_backend/.env
cp mr_ict_frontend/.env.example mr_ict_frontend/.env
cp mr_ict_admin/.env.example mr_ict_admin/.env
```

Each `.env` exposes:
- **Backend**: Postgres/Redis/MinIO endpoints, CORS origins, JWT lifetimes, and email defaults.
- **Frontends**: API base URL plus login/refresh endpoints so axios instances read from the same source of truth.

### 3. Run the Full Stack with Docker Compose
```bash
docker compose up --build
```
This command launches Postgres, Redis, MinIO, the Django API, a Celery worker, a Celery beat scheduler, and both Vite dev servers. The services are available at:
- http://localhost:8000 – Django API
- http://localhost:5173 – Student experience
- http://localhost:5174 – Admin console
- http://localhost:9001 – MinIO console (user/password `mrict` / `mrict-storage`)
- http://localhost:5555 – Flower dashboard for monitoring Celery tasks

If you prefer running pieces manually, start Postgres & Redis with Docker, then use `npm run dev` inside each frontend folder and `python manage.py runserver` for Django.

### 4. Authentication Flow
- Django now issues **JWT access/refresh tokens** for every registration/login response.
- Legacy `token` fields still mirror the access token to keep existing localStorage reads working during the migration.
- Both React apps share a centralized axios client that attaches the `Authorization: Bearer <token>` header, generates request-tracing IDs, retries transient failures, and automatically refreshes expired access tokens using the stored refresh token.

### 5. Useful Commands
```bash
# Django checks
python mr_ict_backend/manage.py check

# Celery worker (if not using Docker Compose)
cd mr_ict_backend
celery -A core worker -l info

# Celery beat scheduler for recurring analytics jobs
celery -A core beat -l info

# Rebuild analytics summaries over a custom window
python mr_ict_backend/manage.py backfill_analytics --days 30

# Frontend lint/format (customise as tooling is added)
npm run lint --prefix mr_ict_frontend
npm run lint --prefix mr_ict_admin
```

## What's Next?
- Wire MinIO/S3 storage into the media pipeline.
- Surface axios request metrics using the new request IDs in monitoring dashboards.
- Add automated lint/test scripts per repo and connect them to CI.

## Analytics & Operations
- The `/api/analytics/admin/summary/` endpoint surfaces aggregated learner engagement, trends, and top courses for the admin dashboard. Add `?format=csv` to download the metrics.
- Frontends can emit lightweight interaction telemetry via `/api/analytics/events/` which feeds the daily summaries.
- A lightweight `/health/` endpoint pings the database, cache, and Celery workers for uptime probes.
- The `backfill_analytics` management command rebuilds daily engagement summaries for any historical window so dashboards remain accurate after migrations or data imports.
- Docker Compose now ships with a Flower instance on http://localhost:5555 for monitoring Celery workers, task queues, and scheduled jobs.

Refer to `AGENTS.md` for the broader delivery plan.
