import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { SchoolsPage } from './pages/SchoolsPage'
import { SchoolDetailPage } from './pages/SchoolDetailPage'
import { SchoolEditorPage } from './pages/SchoolEditorPage'
import { UsersPage } from './pages/UsersPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CourseEditorPage } from './pages/CourseEditorPage'
import { RecordingStudioPage } from './pages/RecordingStudioPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="schools" element={<SchoolsPage />} />
              <Route path="schools/new" element={<SchoolEditorPage />} />
              <Route path="schools/:id" element={<SchoolDetailPage />} />
              <Route path="schools/:id/edit" element={<SchoolEditorPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/new" element={<CourseEditorPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:id/edit" element={<CourseEditorPage />} />
              <Route path="challenges" element={<div className="text-2xl font-bold text-slate-900 dark:text-white">Challenges Page - Coming Soon</div>} />
              <Route path="community" element={<div className="text-2xl font-bold text-slate-900 dark:text-white">Community Page - Coming Soon</div>} />
              <Route path="analytics" element={<div className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Page - Coming Soon</div>} />
              <Route path="settings" element={<div className="text-2xl font-bold text-slate-900 dark:text-white">Settings Page - Coming Soon</div>} />
            </Route>
            <Route
              path="/recording"
              element={
                <ProtectedRoute>
                  <RecordingStudioPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
