# Implementation Roadmap & Checklist
**Wiring New UIs to Backend - Week by Week Plan**

> 📋 Check off tasks as you complete and test them. Mark with `[x]` when done.

---

## Overview

This roadmap provides a practical, week-by-week plan to align `mr_ict_student` and `mr_ict_admin2` with `mr_ict_backend`.

**Total Timeline:** 8 weeks  
**Approach:** Incremental delivery with working features each week  
**Progress Tracking:** Check off `[ ]` boxes as you complete each task

---

## WEEK 1: Foundation & Quick Wins

### Goals
- [ ] Get authentication working
- [ ] Wire existing course catalog
- [ ] Set up API integration layer

### Backend Tasks

#### 1. API Base Configuration
- [x] Set up CORS for new frontend ports (student app, admin app)
- [x] Configure JWT token endpoints (`/api/token/`, `/api/token/refresh/`)
- [x] Test authentication flow with Postman/curl
- [x] Document API base URLs in `.env.example`

#### 2. Enhance Existing Serializers
- [x] Add computed `badge_count` field to StudentSerializer
- [x] Add computed `enrollment_stats` to CourseSerializer
- [x] Create nested `ModuleSerializer` for course details
- [x] Add pagination to course list endpoint (PageNumberPagination, page_size=20)
- [x] Test serializer output in Django shell

#### 3. Student Profile Endpoint
- [x] Create `GET /api/students/me/` endpoint
- [x] Create `PATCH /api/students/me/` endpoint
- [x] Add permission checks (IsAuthenticated)
- [x] Write unit tests for profile endpoints
- [x] Test with authenticated requests

### Frontend Tasks (mr_ict_student)

#### 1. Set up API Client
- [x] Create `src/lib/api.ts` with axios instance
- [x] Configure base URL from environment variable
- [x] Add token interceptor for Authorization header
- [x] Implement refresh token logic
- [x] Add error interceptor for 401 responses
- [x] Test API client with mock endpoints

#### 2. Wire Authentication Pages
- [x] Connect SignInPage to `POST /api/accounts/login/`
- [x] Connect SignUpPage to `POST /api/accounts/register/`
- [x] Store tokens in localStorage
- [x] Implement auto-redirect after login
- [x] Add loading states to auth forms
- [x] Test sign in/up flows end-to-end

#### 3. Wire Catalog Page
- [x] Connect CatalogPage to `GET /api/courses/`
- [x] Connect CourseDetailPage to `GET /api/courses/{id}/`
- [x] Add loading skeletons
- [x] Handle empty states
- [x] Test with real backend data

### Frontend Tasks (mr_ict_admin2)

#### 1. Admin Setup
- [x] Create `src/lib/api.ts` with axios instance
- [x] Wire admin authentication pages
- [x] Connect CoursesPage to `GET /api/courses/`
- [x] Test admin login and course list

### Week 1 Deliverables
- [ ] ✅ Students can sign in and browse courses
- [ ] ✅ Admins can sign in and view course list
- [ ] ✅ All authentication flows tested
- [ ] ✅ API integration working for both apps

---

## WEEK 2: Critical Model Changes

### Goals
- [ ] Add missing fields to models
- [ ] Create and run migrations
- [ ] Update serializers

### Backend Tasks

#### 1. Student Model Enhancements
- [x] Add `streak_days` field (IntegerField, default=0)
- [x] Add `last_activity_date` field (DateField, null=True)
- [x] Add `availability` field (CharField, max_length=100)
- [x] Add `learning_goals` field (TextField)
- [x] Add `preferred_mode` field (CharField with choices)
- [x] Test model changes in Django shell

#### 2. Course Model Enhancements
- [x] Add `subtitle` field (CharField, max_length=500)
- [x] Add `track` field (CharField with choices: Web/Data/Design)
- [x] Add `spotlight` field (TextField)
- [x] Create `CourseInstructor` model with M2M relationship
- [x] Add `order`, `role`, `bio` fields to CourseInstructor
- [x] Test model relationships

#### 3. Lesson Model Enhancements
- [x] Add `lesson_type` field (CharField with choices)
- [x] Create `LessonVersionMarker` model
- [x] Add fields: `marker_id`, `label`, `timecode`, `position`, `marker_type` 
- [x] Test version marker creation

#### 4. Run Migrations
- [x] Create migrations: `python manage.py makemigrations` 
- [x] Review migration files
- [x] Apply migrations: `python manage.py migrate` 
- [x] Verify migrations: `python manage.py showmigrations` 

#### 5. Update Serializers
- [x] Update `StudentSerializer` with new fields
- [x] Create `CourseInstructorSerializer` 
- [x] Update `LessonSerializer` with `lesson_type` 
- [x] Create `LessonVersionMarkerSerializer` 

#### 6. Create Onboarding Endpoint
- [x] Create `PATCH /api/students/me/onboarding/` endpoint
- [x] Validate onboarding data
- [x] Set `has_completed_onboarding = True` 
- [x] Test endpoint with sample data

### Frontend Tasks (mr_ict_student)

#### 1. Wire Onboarding Page
- [x] Connect OnboardingPage to onboarding endpoint
- [x] Send all onboarding form data
- [x] Handle success/error responses
- [x] Redirect to dashboard after completion
- [x] Test complete onboarding flow
- [ ] Connect OnboardingPage to onboarding endpoint
- [ ] Send all onboarding form data
- [ ] Handle success/error responses
- [ ] Redirect to dashboard after completion
- [ ] Test complete onboarding flow

#### 2. Update Course Detail Page
- [ ] Display course instructors with avatars
- [ ] Show course track badge
- [ ] Display spotlight text
- [ ] Test with multiple instructors

### Week 2 Deliverables
- [ ] ✅ All model migrations applied successfully
- [ ] ✅ Onboarding flow works end-to-end
- [ ] ✅ Course pages show enhanced metadata
- [ ] ✅ No breaking changes to existing features

---

## WEEK 3: Dashboard & Progress

### Goals
- [ ] Build dashboard API
- [ ] Wire progress tracking
- [ ] Display student stats

### Backend Tasks

#### 1. Create Dashboard Endpoint
- [ ] Create `GET /api/students/me/dashboard/` view
- [ ] Include: XP, streak, badges count, days_active
- [ ] Include: enrolled courses with progress
- [ ] Include: upcoming assessments (next 7 days)
- [ ] Include: recent announcements (last 5)
- [ ] Optimize queries with select_related/prefetch_related
- [ ] Write unit tests for dashboard endpoint
- [ ] Test response time (<500ms)

#### 2. Enhance Progress Tracking
- [ ] Create `PATCH /api/students/me/lessons/{id}/progress/` endpoint
- [ ] Accept `last_position_seconds` and `completed` fields
- [ ] Update `StudentLesson` record
- [ ] Recalculate course progress percentage
- [ ] Test progress updates

#### 3. Course Enrollment
- [ ] Create `POST /api/courses/{id}/enroll/` endpoint
- [ ] Create `StudentCourse` record
- [ ] Set initial progress to 0%
- [ ] Return enrollment details
- [ ] Prevent duplicate enrollments
- [ ] Test enrollment flow

#### 4. Streak Calculation
- [ ] Create `calculate_streak()` utility function
- [ ] Update streak on student activity
- [ ] Create signal to track daily activity
- [ ] Add streak to dashboard response
- [ ] Test streak calculation logic

#### 5. Announcements Endpoint
- [ ] Create `GET /api/announcements/` endpoint
- [ ] Filter by student's enrolled courses
- [ ] Include pinned announcements first
- [ ] Exclude expired announcements
- [ ] Add pagination (10 per page)
- [ ] Test filtering logic

### Frontend Tasks (mr_ict_student)

#### 1. Wire Dashboard Page
- [ ] Fetch dashboard data on mount
- [ ] Display XP with formatted number
- [ ] Display streak with fire emoji
- [ ] Display badge count
- [ ] Show enrolled courses with progress bars
- [ ] Display announcements list
- [ ] Add loading states
- [ ] Handle empty states
- [ ] Test dashboard with real data

#### 2. Wire Enrollment Flow
- [ ] Add "Enroll" button on CourseDetailPage
- [ ] Call enrollment endpoint on click
- [ ] Show loading state during enrollment
- [ ] Update UI to show "Continue Learning"
- [ ] Handle already enrolled state
- [ ] Test enrollment flow

#### 3. Track Lesson Views
- [ ] Send progress update every 10 seconds during playback
- [ ] Send final progress on lesson exit
- [ ] Update local state optimistically
- [ ] Handle offline scenarios
- [ ] Test progress tracking

### Week 3 Deliverables
- [ ] ✅ Dashboard shows real student data
- [ ] ✅ Progress tracking works reliably
- [ ] ✅ Enrollment flow complete
- [ ] ✅ Streak calculation accurate

---

## WEEK 4: Lesson Player

### Goals
- [ ] Build Scrimba-style lesson player
- [ ] Wire video and code sync
- [ ] Implement progress persistence

### Backend Tasks

#### 1. Enhance Lesson Endpoints
- [ ] Update `GET /api/lessons/{id}/` to include all media
- [ ] Include: `LessonVideo` with subtitles
- [ ] Include: `LessonCodeSnippet` with file info
- [ ] Include: `LessonVersionMarker` ordered by position
- [ ] Optimize with prefetch_related
- [ ] Test endpoint response structure

#### 2. Add Code Snippet File Support
- [ ] Add `file_name` field to LessonCodeSnippet
- [ ] Add `file_type` field (html/css/js/markdown)
- [ ] Create migration for new fields
- [ ] Update existing snippets with default file_name
- [ ] Test multi-file snippet retrieval

#### 3. Progress Update Endpoint
- [ ] Enhance `PATCH /api/students/me/lessons/{id}/progress/`
- [ ] Accept `last_position_seconds` field
- [ ] Accept `resume_code_id` field (optional)
- [ ] Update `StudentLesson.last_viewed_at`
- [ ] Calculate and update completion percentage
- [ ] Test progress persistence

### Frontend Tasks (mr_ict_student)

#### 1. Build Lesson Player UI
- [ ] Integrate Monaco Editor component
- [ ] Create floating video window with drag support
- [ ] Create floating preview window (iframe)
- [ ] Implement window minimize/maximize/fullscreen
- [ ] Add playback controls (play/pause/seek)
- [ ] Display version markers on timeline
- [ ] Test UI responsiveness

#### 2. Implement Video-Code Sync
- [ ] Load code snippets for current timestamp
- [ ] Update Monaco editor when video progresses
- [ ] Highlight active version marker
- [ ] Allow jumping to markers
- [ ] Test sync accuracy

#### 3. Multi-File Support
- [ ] Create file tabs (index.html, styles.css, notes)
- [ ] Switch Monaco language based on file type
- [ ] Load appropriate code for each file
- [ ] Test file switching

#### 4. Auto-Save Implementation
- [ ] Save progress every 10 seconds
- [ ] Debounce progress updates
- [ ] Show "Autosave synced" indicator
- [ ] Handle offline scenarios
- [ ] Test auto-save reliability

#### 5. Completion Tracking
- [ ] Mark lesson complete at 90% progress
- [ ] Show completion checkmark
- [ ] Update course progress bar
- [ ] Navigate to next lesson on complete
- [ ] Test completion flow

### Week 4 Deliverables
- [ ] ✅ Interactive lesson player works
- [ ] ✅ Progress persists across sessions
- [ ] ✅ Students can resume where they left off
- [ ] ✅ Multi-file editing functional

---

## WEEK 5: Assessments & Challenges

### Goals
- Wire assessment taking
- Connect coding sandbox
- Implement XP rewards

### Backend Tasks
1. **Enhance assessment endpoints**
   ```python
   GET /api/assessments/
   GET /api/assessments/{id}/
   POST /api/assessments/{id}/submit/
   ```

2. **Add assessment type and focus**
   - Update Assessment model
   - Update serializers

3. **Wire coding challenge endpoints**
   ```python
   GET /api/challenges/
   GET /api/challenges/{id}/
   POST /api/challenges/{id}/run/
   POST /api/challenges/{id}/submit/
   ```

4. **Implement XP rewards**
   - Award XP on assessment completion
   - Award XP on challenge completion
   - Create StudentXPEvent records

### Frontend Tasks (mr_ict_student)
1. **Wire assessments page**
   - List available assessments
   - Show attempts left
   - Display due dates

2. **Build assessment taking UI**
   - Question display
   - Answer submission
   - Results display

3. **Wire sandbox page**
   - Load challenge data
   - Implement code editor
   - Run code against test cases
   - Show results

### Deliverable
✅ Students can take assessments
✅ Coding challenges work end-to-end
✅ XP rewards are granted

---

## WEEK 6: Community & Engagement

### Goals
- Build community features
- Add daily focus
- Implement live sessions

### Backend Tasks
1. **Create community app**
   ```bash
   python manage.py startapp community
   ```

2. **Create community models**
   - CommunityThread
   - ThreadReply

3. **Create community endpoints**
   ```python
   GET /api/community/threads/
   POST /api/community/threads/
   GET /api/community/threads/{id}/
   POST /api/community/threads/{id}/replies/
   ```

4. **Create engagement models**
   - DailyFocus
   - LiveSession
   - OfflineContentPack

5. **Create engagement endpoints**
   ```python
   GET /api/students/me/daily-focus/
   GET /api/live-sessions/
   GET /api/offline-packs/
   ```

### Frontend Tasks (mr_ict_student)
1. **Wire community page**
   - List threads
   - Create new threads
   - Reply to threads
   - Like/react

2. **Add daily focus to dashboard**
   - Fetch daily focus
   - Display win, intention, encouragement

3. **Add live sessions to dashboard**
   - Show upcoming sessions
   - Join meeting links

### Deliverable
✅ Community discussions work
✅ Daily focus appears on dashboard
✅ Live sessions are displayed

---

## WEEK 7: Admin Features

### Goals
- Complete admin course management
- Add user management
- Enhance school management

### Backend Tasks
1. **Enhance school model**
   - Add school_type, status, principal
   - Create migrations

2. **Create school endpoints**
   ```python
   GET /api/admin/schools/
   POST /api/admin/schools/
   GET /api/admin/schools/{id}/
   PATCH /api/admin/schools/{id}/
   GET /api/admin/schools/{id}/stats/
   ```

3. **Create user management endpoints**
   ```python
   GET /api/admin/users/
   GET /api/admin/users/{id}/
   PATCH /api/admin/users/{id}/status/
   ```

4. **Create analytics endpoints**
   ```python
   GET /api/admin/dashboard/stats/
   GET /api/admin/analytics/enrollments/
   GET /api/admin/analytics/completion-rates/
   ```

### Frontend Tasks (mr_ict_admin2)
1. **Wire dashboard**
   - Fetch platform stats
   - Display charts
   - Show recent activity

2. **Wire school management**
   - List schools
   - Create/edit schools
   - View school details and stats

3. **Wire user management**
   - List users with filters
   - View user details
   - Suspend/activate users

4. **Enhance course editor**
   - Add module/lesson management
   - Upload media
   - Publish workflow

### Deliverable
✅ Admin dashboard shows platform metrics
✅ School management works
✅ User management operational
✅ Course editor fully functional

---

## WEEK 8: Polish & Optimization

### Goals
- Optimize performance
- Add caching
- Complete documentation
- Bug fixes

### Backend Tasks
1. **Performance optimization**
   - Add database indexes
   - Optimize queries (select_related, prefetch_related)
   - Add query caching

2. **Add pagination everywhere**
   - Implement cursor pagination
   - Add page size limits

3. **Add filtering and search**
   - Django filters on list endpoints
   - Full-text search on courses

4. **API documentation**
   - Generate OpenAPI/Swagger docs
   - Add endpoint descriptions
   - Include request/response examples

5. **Error handling**
   - Standardize error responses
   - Add validation messages
   - Implement rate limiting

### Frontend Tasks (Both Apps)
1. **Error handling**
   - Add error boundaries
   - Display user-friendly messages
   - Implement retry logic

2. **Loading states**
   - Add skeletons
   - Show spinners
   - Implement optimistic updates

3. **Offline support (student app)**
   - Cache API responses
   - Queue mutations
   - Sync when online

4. **Testing**
   - Unit tests for critical functions
   - Integration tests for API calls
   - E2E tests for key flows

5. **Documentation**
   - README updates
   - Setup instructions
   - Deployment guides

### Deliverable
✅ Apps are performant and polished
✅ Error handling is robust
✅ Documentation is complete
✅ Ready for production

---

## Success Metrics

### Week 1-2 Milestones
- [ ] Authentication works for both apps
- [ ] Course catalog displays correctly
- [ ] Onboarding flow complete
- [ ] All model migrations applied

### Week 3-4 Milestones
- [ ] Dashboard shows real data
- [ ] Lesson player functional
- [ ] Progress tracking works
- [ ] Video playback with code sync

### Week 5-6 Milestones
- [ ] Assessments can be taken
- [ ] Coding challenges work
- [ ] Community features live
- [ ] XP rewards system functional

### Week 7-8 Milestones
- [ ] Admin features complete
- [ ] Performance optimized
- [ ] Documentation done
- [ ] Production ready

---

## Risk Mitigation

### Potential Blockers
1. **Database migrations fail**
   - Mitigation: Test on staging first, have rollback plan

2. **API performance issues**
   - Mitigation: Add caching early, monitor query counts

3. **Frontend-backend contract mismatch**
   - Mitigation: Use TypeScript types, validate early

4. **Video processing complexity**
   - Mitigation: Use existing services (AWS MediaConvert, Cloudinary)

### Contingency Plans
- Keep old frontends running in parallel
- Feature flags for gradual rollout
- Rollback procedures documented

---

## Team Coordination

### Daily Standups
- What did you complete yesterday?
- What are you working on today?
- Any blockers?

### Weekly Reviews
- Demo completed features
- Review code
- Plan next week

### Communication Channels
- Slack/Discord for quick questions
- GitHub issues for bugs
- Pull requests for code review

---

## Post-Launch (Week 9+)

### Monitoring
- Set up error tracking (Sentry)
- Monitor API performance (New Relic, DataDog)
- Track user analytics (Mixpanel, Amplitude)

### Iteration
- Gather user feedback
- Fix bugs
- Add requested features

### Maintenance
- Regular dependency updates
- Security patches
- Performance tuning

---

## CONCLUSION

This roadmap provides a structured approach to aligning your new UIs with the backend. The key is **incremental delivery** - each week should produce working features that add value.

**Remember:**
- Test thoroughly at each stage
- Keep old systems running until new ones are stable
- Communicate progress regularly
- Don't hesitate to adjust timeline based on learnings

**You've got this! 🚀**
