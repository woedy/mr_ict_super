# Mr ICT Frontend Checklist

Use this checklist to plan, implement, and validate the frontend experience.

## Authentication & Onboarding
- [ ] Email/password login and signup
- [x] OTP verification via email
- [ ] Forgot/reset password
- [ ] First-time onboarding and profile setup

## Learner Dashboard & Navigation
- [ ] Resume last lesson
- [ ] My courses with progress
- [ ] Recommended next lessons/tasks
- [ ] Quick links: practice, quizzes, certificates

## Courses & Lessons
- [ ] Course catalog with filters and enrollment
- [ ] Lesson viewer (video + reading + attachments)
- [ ] Mark lesson complete and track streaks
- [ ] Module structure UI: course → modules → lessons

## Interactive Coding Engine
- [x] Monaco editor per lesson step
- [ ] Run code with output console (JS first)
- [ ] Starter code, hints, and solution reveal after attempts
- [ ] Auto-save drafts per lesson/user

## LLM Tutor
- [x] Step-aware tutor panel (explanations)
- [x] Ask a question input and response rendering
- [x] Assignment feedback indicators
- [ ] TTS playback toggle
- [ ] Error and offline handling

## Recording & Playback (Student)
- [ ] Admin-recorded lessons visible in list
- [x] Playback page: video + synchronized code timeline
- [ ] Jump to key frames/highlights
- [ ] Robust error/offline handling during playback

Note: Recording is admin-only. Students do not record or upload videos; they only consume published lessons.

## Quizzes & Practice
- [ ] MCQ quizzes with per-question feedback
- [ ] Practice exercises (topic/difficulty filters)
- [ ] Retakes and score history
- [ ] Timed vs. untimed modes

## Progress, Rewards, Certificates
- [ ] XP/level progress displays
- [ ] Badge gallery and milestones
- [ ] Course completion and certificate download UI

## Profile & Settings
- [ ] Edit bio, avatar, contact details, password
- [ ] Certificate gallery
- [ ] Notification preferences and theme

## Community & Engagement
- [ ] Lesson comments and reactions
- [ ] Leaderboards (school/region)
- [ ] Announcements and notifications UI

## Integration & Config
- [ ] Central axios client with auth header injection
- [ ] Vite env-based base URL and feature flags
- [ ] Toasts and consistent error handling
- [ ] Basic analytics event hooks (page, lesson, code run)
