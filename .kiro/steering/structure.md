# Project Structure

## Repository Organization

The Mr ICT platform consists of three main applications in separate directories:

```
mr_ict_backend/     # Django REST API backend
mr_ict_frontend/    # React student-facing application  
mr_ict_admin/       # React admin application for content creation
```

## Backend Structure (mr_ict_backend/)

### Django Apps
- **accounts/**: Custom user model, authentication, registration flows
- **courses/**: Course and lesson management (video, snippets, metadata)
- **llm_tutor/**: AI tutor functionality, RAG retriever, lesson steps
- **video_tutorials/**: Recording models, code snapshots, media processing
- **schools/**: School management and dashboards
- **students/**: Student-specific functionality and progress tracking
- **teachers/**: Teacher dashboards and course management
- **activities/**: Learning activities and assignments
- **assessments/**: Student assessment and grading
- **notifications/**: Simple notification system
- **homepage/**: Landing page and public content
- **mr_admin/**: Admin-specific functionality
- **core/**: Django project settings, URLs, ASGI/WSGI config

### Key Files
- **manage.py**: Django management commands
- **requirements.txt**: Python dependencies
- **clean_migrations.py**: Utility to reset Django migrations
- **db.sqlite3**: Default SQLite database (dev)
- **data/**: Contains curriculum data and FAISS vector indices

### API Structure
- `/api/...`: Main REST API endpoints
- `/llm-tutor/api/...`: AI tutor specific endpoints
- `/admin/`: Django admin interface

## Frontend Structure (mr_ict_frontend/ & mr_ict_admin/)

Both React applications share similar structure:

### Configuration Files
- **package.json**: Dependencies and scripts
- **vite.config.js**: Vite bundler configuration
- **tailwind.config.cjs**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **.prettierrc**: Code formatting rules

### Source Structure
- **src/**: Main application source code
- **public/**: Static assets
- **index.html**: Entry HTML file

### Key Differences
- **mr_ict_frontend**: Student-facing UI, lesson playback, coding exercises
- **mr_ict_admin**: Content creation, lesson recording, admin dashboards

## Data Flow Architecture

### Recording Workflow (Admin → Student)
1. **Admin App**: Records screen + audio, captures code snapshots
2. **Backend**: Processes media, stores snapshots with timestamps
3. **Student App**: Plays back synchronized video + code states

### Learning Workflow (Student ↔ AI Tutor)
1. **Student App**: Monaco editor for coding exercises
2. **Backend**: Compares code vs expected, retrieves curriculum context
3. **AI Tutor**: Provides step-aware guidance via local LLM
4. **Student App**: Displays tutor feedback and progress

## Configuration Patterns

### Backend Settings
- Environment-driven configuration in `core/settings.py`
- Separate dev/prod settings via environment variables
- Database, Redis, email, and CORS configured via env

### Frontend Constants
- Configuration in `src/constants.tsx` (should migrate to Vite env vars)
- API endpoints, user tokens stored in localStorage
- Base URLs for API, media, and WebSocket connections

## File Naming Conventions

### Backend (Django)
- **models.py**: Database models
- **views.py**: API endpoints and business logic
- **urls.py**: URL routing
- **serializers.py**: DRF serializers for API responses
- **admin.py**: Django admin configuration

### Frontend (React)
- **PascalCase** for component files
- **camelCase** for utility functions and hooks
- **kebab-case** for CSS classes (Tailwind)
- **UPPER_CASE** for constants

## Development Workflow

### Local Development
1. Backend runs on `localhost:8000`
2. Student frontend on `localhost:4173` 
3. Admin frontend on separate port
4. Redis for Channels/Celery on `localhost:6379`
5. Local LLM on `localhost:11434`

### Docker Development
- Each app has its own Dockerfile and docker-compose.yml
- Shared network for inter-service communication
- Volume mounts for live code reloading

## Security Considerations

### Authentication Flow
- Custom User model in accounts app
- JWT tokens for API authentication
- Role-based access (Student vs Admin vs Teacher)
- CORS configured per environment

### Data Protection
- Admin-only recording and content creation
- Students can only access published content
- Environment-based security settings
- CSRF protection for session-based flows