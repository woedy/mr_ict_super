import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'

export function RequireAuth() {
  const { isAuthenticated } = useStudentJourney()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function RequireProfileComplete() {
  const { profileComplete } = useStudentJourney()
  const location = useLocation()

  if (!profileComplete) {
    return <Navigate to="/onboarding" replace state={{ from: location }} />
  }

  return <Outlet />
}
