import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import Dashboard from './pages/Dashboard/Dashboard';
import DefaultLayout from './layout/DefaultLayout';
import SignUp from './pages/Authentication/SignUp';
import SignIn from './pages/Authentication/SignIn';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import Lessons from './pages/Courses/Lessons.tsx';
import LessonViewer from './pages/Courses/LessonViewer.tsx';
import AllCourses from './pages/Courses/AllCourses.tsx';
import RecordedCourseLessons from './pages/RecordedVideos/RecordedCourseLessons.tsx';
import RecordLessonPage from './pages/RecordLesson/RecordLessonPage.tsx';
import RecordVideoPlayer from './pages/RecordedVideos/VideoPlayer/RecordVideoPlayer.tsx';
import CodingSandbox from './pages/Playground/CodingSandbox.tsx';
import ProjectWorkspace from './pages/Projects/Workspace.tsx';
import EditorLayout from './pages/GPTEditor/EditorLayout.tsx';
import CourseChallenges from './pages/Courses/CourseChallenges.tsx';
import Challenges from './pages/Courses/Challenges.tsx';
import AllMyCourses from './pages/MyCourses/AllMyCourses.tsx';
import VerifyEmail from './pages/Authentication/VerifyEmail.tsx';
import Onboarding from './pages/Onboarding/Onboarding.tsx';
import LmmTutor from './pages/LLMtutor/LmmTutor.tsx';
import AssessmentsList from './pages/Assessments/AssessmentsList.tsx';
import TakeAssessment from './pages/Assessments/TakeAssessment.tsx';
import ProgressOverview from './pages/Progress/ProgressOverview.tsx';
import Announcements from './pages/Community/Announcements.tsx';
import LessonDiscussion from './pages/Community/LessonDiscussion.tsx';

const hiddenOnRoutes = [
  '/',
  '/signup',
  '/sign-in',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/onboarding',

  '/record-lesson-page',
  '/recorded-course-lessons',
  '/record-player',

  '/sandbox',
  '/projects/workspace',

  '/llm-tutor',

  '/gpt-editor',
];

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Determine if the current route should skip the layout
  const shouldUseDefaultLayout = !hiddenOnRoutes.includes(location.pathname);

  return loading ? (
    <Loader />
  ) : shouldUseDefaultLayout ? (
    <DefaultLayout hiddenOnRoutes={hiddenOnRoutes}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Dashboard | <Mr ICT />" />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/all-courses"
          element={
            <>
              <PageTitle title="All Course - <Mr ICT />" />
              <AllCourses />
            </>
          }
        />

        <Route
          path="/lessons"
          element={
            <>
              <PageTitle title="Lessons - <Mr ICT />" />
              <Lessons />
            </>
          }
        />

        <Route
          path="/course-challenges"
          element={
            <>
              <PageTitle title="Course Challenges - <Mr ICT />" />
              <CourseChallenges />
            </>
          }
        />

        <Route
          path="/assessments"
          element={
            <>
              <PageTitle title="Assessments - <Mr ICT />" />
              <AssessmentsList />
            </>
          }
        />

        <Route
          path="/assessments/:slug"
          element={
            <>
              <PageTitle title="Take Assessment - <Mr ICT />" />
              <TakeAssessment />
            </>
          }
        />

        <Route
          path="/progress"
          element={
            <>
              <PageTitle title="Progress & Rewards - <Mr ICT />" />
              <ProgressOverview />
            </>
          }
        />

        <Route
          path="/community/announcements"
          element={
            <>
              <PageTitle title="Community Announcements - <Mr ICT />" />
              <Announcements />
            </>
          }
        />

        <Route
          path="/community/lessons/:lessonId"
          element={
            <>
              <PageTitle title="Lesson Discussion - <Mr ICT />" />
              <LessonDiscussion />
            </>
          }
        />

        <Route
          path="/challenges"
          element={
            <>
              <PageTitle title="Challenges - <Mr ICT />" />
              <Challenges />
            </>
          }
        />

<Route
          path="/all-my-courses"
          element={
            <>
              <PageTitle title="My Courses - <Mr ICT />" />
              <AllMyCourses />
            </>
          }
        />




      </Routes>
    </DefaultLayout>
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Sign In | <Mr ICT />" />
              <SignIn />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <PageTitle title="Sign Up | <Mr ICT />" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/lesson"
          element={
            <>
              <PageTitle title="Lesson | <Mr ICT />" />
              <LessonViewer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <PageTitle title="Forgot Password | <Mr ICT />" />
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/reset-password"
          element={
            <>
              <PageTitle title="Reset Password | <Mr ICT />" />
              <ResetPassword />
            </>
          }
        />
        <Route
          path="/sign-in"
          element={
            <>
              <PageTitle title="Sign In | <Mr ICT />" />
              <SignIn />
            </>
          }
        />

        <Route
          path="/onboarding"
          element={
            <>
              <PageTitle title="Tell us about you | <Mr ICT />" />
              <Onboarding />
            </>
          }
        />

        <Route
          path="/recorded-course-lessons"
          element={
            <>
              <PageTitle title="All Course - <Mr ICT />" />
              <RecordedCourseLessons />
            </>
          }
        />

        <Route
          path="/record-lesson-page"
          element={
            <>
              <PageTitle title="Record Lesson Page | <Mr ICT />" />
              <RecordLessonPage />
            </>
          }
        />

        <Route
          path="/verify-email"
          element={
            <>
              <PageTitle title="Verify Email | <Mr ICT />" />
              <VerifyEmail />
            </>
          }
        />
        <Route
          path="/record-player"
          element={
            <>
              <PageTitle title="Record Player | <Mr ICT />" />
              <RecordVideoPlayer />
            </>
          }
        />

        <Route
          path="/sandbox"
          element={
            <>
              <PageTitle title="Coding Sandbox | <Mr ICT />" />
              <CodingSandbox />
            </>
          }
        />

        <Route
          path="/projects/workspace"
          element={
            <>
              <PageTitle title="Project Workspace | <Mr ICT />" />
              <ProjectWorkspace />
            </>
          }
        />

        <Route
          path="/gpt-editor"
          element={
            <>
              <PageTitle title="GPT Editor | <Mr ICT />" />
              <EditorLayout />
            </>
          }
        />


<Route
          path="/llm-tutor"
          element={
            <>
              <PageTitle title="Verify Email | <Mr ICT />" />
              <LmmTutor />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
