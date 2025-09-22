# Technology Stack

## Backend (mr_ict_backend)

**Framework**: Django 5 + Django REST Framework
- **Database**: SQLite (dev), PostgreSQL (prod) - configurable via env
- **Authentication**: Custom User model, SimpleJWT + Token Auth (needs unification)
- **Real-time**: Django Channels with Redis backend, ASGI via Daphne
- **Background Tasks**: Celery with Redis broker
- **AI/ML**: sentence-transformers + FAISS for RAG, local LLM (Ollama at localhost:11434)
- **Media Processing**: ffmpeg-python for video transcoding
- **CORS**: django-cors-headers

### Key Dependencies
```
Django, djangorestframework, channels, celery, redis
psycopg2-binary, daphne, djangorestframework-simplejwt
ffmpeg-python, sentence-transformers, faiss-cpu
```

## Frontend Applications

### Student Frontend (mr_ict_frontend)
**Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Chakra UI
- **State Management**: Zustand + local component state
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **HTTP Client**: axios + fetch (should unify to axios)
- **Additional**: react-dnd, ApexCharts, react-player

### Admin Frontend (mr_ict_admin)
**Framework**: React 18 + Vite (same stack as student frontend)
- **Additional**: react-circular-progressbar for admin dashboards
- **Recording**: MediaRecorder API for screen + audio capture

## Common Build Commands

### Backend
```bash
# Setup
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Database
python manage.py migrate
python manage.py createsuperuser

# Development
python manage.py runserver
celery -A core worker -l info  # Background tasks
celery -A core beat -l info    # Scheduled tasks

# Utilities
python clean_migrations.py    # Clean migration files
```

### Frontend (both apps)
```bash
# Setup
npm ci

# Development
npm run dev        # Vite dev server (port 4173)
npm run build      # Production build
npm run preview    # Preview production build
npm start          # Preview with host binding
```

## Environment Configuration

### Backend Environment Variables
```
DJANGO_SECRET_KEY, DJANGO_DEBUG, DJANGO_ALLOWED_HOSTS
DB_ENGINE, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
CELERY_BROKER_URL, CORS_ALLOWED_ORIGINS
DJANGO_EMAIL_*, DJANGO_DEFAULT_FROM_EMAIL
```

### Frontend Environment Variables
Use Vite env variables (VITE_*) instead of hardcoded constants:
```
VITE_API_BASE_URL, VITE_MEDIA_BASE_URL, VITE_WS_BASE_URL
```

## Docker Setup

Both frontend apps use Node 16 with identical Dockerfiles:
```dockerfile
FROM node:16
WORKDIR /god_bless_app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

## Development Workflow

1. Start Redis server for Channels/Celery
2. Run Django backend: `python manage.py runserver`
3. Start Celery worker (if using background tasks)
4. Run local LLM server (Ollama on port 11434)
5. Start frontend(s): `npm run dev`
6. Build FAISS index for AI tutor (one-time setup)

## Code Quality Tools

- **Prettier**: Configured for both frontend apps
- **Tailwind**: PostCSS + autoprefixer setup
- **TypeScript**: Configured for React apps