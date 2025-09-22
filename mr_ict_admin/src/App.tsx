import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import Dashboard from './pages/Dashboard/Dashboard';
import DefaultLayout from './layout/DefaultLayout';
import SignIn from './pages/Authentication/SignIn';
import VerifyUser from './pages/Authentication/VerifyEmail.tsx';
import Lessons from './pages/Courses/Lessons.tsx';
import AllCourses from './pages/Courses/AllCourses.tsx';
import CourseChallenges from './pages/Courses/CourseChallenges.tsx';
import Challenges from './pages/Courses/Challenges.tsx';
import AllStudents from './pages/Students/ListAllStudents.tsx';
import StudentDetails from './pages/Students/StudentDetails.tsx';
import ForgotPassword from './pages/Authentication/Password/ForgotPassword.tsx';
import ConfirmPasswordOTP from './pages/Authentication/Password/ConfirmPasswordOTP.tsx';
import NewPassword from './pages/Authentication/Password/NewPassword.tsx';
import SignUp from './pages/Authentication/SignUp.tsx';
import ArchivedStudents from './pages/Students/ListArchivedStudents.tsx';
import AllSchools from './pages/Schools/ListAllSchools.tsx';
import ArchivedSchools from './pages/Schools/ListArchivedSchool.tsx';
import SchoolDetails from './pages/Schools/SchoolDetails.tsx';
import RecordedCourseLessons from './pages/RecordedVideos/RecordedCourseLessons.tsx';
import RecordLessonPage from './pages/RecordLesson/RecordLessonPage.tsx';
import RecordVideoPlayer from './pages/RecordedVideos/VideoPlayer/RecordVideoPlayer.tsx';
import EditorLayout from './GPTEditor/EditorLayout.tsx';
import LmmTutor from './pages/LLMtutor/LmmTutor.tsx';

const hiddenOnRoutes = [
  '/',
  '/sign-up',
  '/sign-in',
  '/verify-email',
  '/forgot-password',
  '/confirm-password-otp',
  '/new-password-reset',

  '/record-lesson-page',
  '/recorded-course-lessons',
  '/record-player',

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
              <PageTitle title="Dashboard | <Mr ICT - Admin />" />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/all-students"
          element={
            <>
              <PageTitle title="All Students - <Mr ICT - Admin />" />
              <AllStudents />
            </>
          }
        />

        <Route
          path="/archived-students"
          element={
            <>
              <PageTitle title="Archived Students - <Mr ICT - Admin />" />
              <ArchivedStudents />
            </>
          }
        />
        <Route
          path="/student-details"
          element={
            <>
              <PageTitle title="All Students - <Mr ICT - Admin />" />
              <StudentDetails />
            </>
          }
        />

        <Route
          path="/all-schools"
          element={
            <>
              <PageTitle title="All Students - <Mr ICT - Admin />" />
              <AllSchools />
            </>
          }
        />

        <Route
          path="/archived-schools"
          element={
            <>
              <PageTitle title="Archived Schools - <Mr ICT - Admin />" />
              <ArchivedSchools />
            </>
          }
        />
        <Route
          path="/school-details"
          element={
            <>
              <PageTitle title="School Details - <Mr ICT - Admin />" />
              <SchoolDetails />
            </>
          }
        />

        <Route
          path="/all-courses"
          element={
            <>
              <PageTitle title="All Course - <Mr ICT - Admin />" />
              <AllCourses />
            </>
          }
        />

        <Route
          path="/lessons"
          element={
            <>
              <PageTitle title="Lessons - <Mr ICT - Admin />" />
              <Lessons />
            </>
          }
        />

        <Route
          path="/course-challenges"
          element={
            <>
              <PageTitle title="Course Challenges - <Mr ICT - Admin />" />
              <CourseChallenges />
            </>
          }
        />

        <Route
          path="/challenges"
          element={
            <>
              <PageTitle title="Challenges - <Mr ICT - Admin />" />
              <Challenges />
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
              <PageTitle title="Sign In | <Mr ICT - Admin />" />
              <SignIn />
            </>
          }
        />

        <Route
          path="/sign-in"
          element={
            <>
              <PageTitle title="Sign In | <Mr ICT - Admin />" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <PageTitle title="Sign Up | <Mr ICT - Admin />" />
              <SignUp />
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
          path="/verify-email"
          element={
            <>
              <PageTitle title="Verify Email | <Mr ICT - Admin />" />
              <VerifyUser />
            </>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <>
              <PageTitle title="Forgot Password | <Mr ICT - Admin />" />
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/confirm-password-otp"
          element={
            <>
              <PageTitle title="Forgot Password | <Mr ICT - Admin />" />
              <ConfirmPasswordOTP />
            </>
          }
        />
        <Route
          path="/new-password-reset"
          element={
            <>
              <PageTitle title="New Password | <Mr ICT - Admin />" />
              <NewPassword />
            </>
          }
        />


// RECORDER 
        <Route
          path="/recorded-course-lessons"
          element={
            <>
              <PageTitle title="All Course - <Mr ICT - Admin/>" />
              <RecordedCourseLessons />
            </>
          }
        />

        <Route
          path="/record-lesson-page"
          element={
            <>
              <PageTitle title="Record Lesson Page | <Mr ICT - Admin/>" />
              <RecordLessonPage />
            </>
          }
        />

        <Route
          path="/record-player"
          element={
            <>
              <PageTitle title="Record Player | <Mr ICT - Admin />" />
              <RecordVideoPlayer />
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
