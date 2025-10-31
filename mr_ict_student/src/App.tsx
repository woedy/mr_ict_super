import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth, RequireProfileComplete } from './components/RouteGuards'
import { ShellLayout } from './layouts/ShellLayout'
import { AssessmentsPage } from './pages/AssessmentsPage'
import { CatalogPage } from './pages/CatalogPage'
import { CommunityPage } from './pages/CommunityPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LandingPage } from './pages/LandingPage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ProfilePage } from './pages/ProfilePage'
import { RoadmapPage } from './pages/RoadmapPage'
import { SandboxPage } from './pages/SandboxPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<RequireProfileComplete />}>
          <Route element={<ShellLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPlayerPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
