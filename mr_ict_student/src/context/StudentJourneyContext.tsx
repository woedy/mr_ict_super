import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { demoStudentProfile, enrollments as defaultEnrollments } from '../data/mockData'
import { authApi, profileApi, tokenManager } from '../lib/api'
import type { ApiError } from '../lib/api'

type StudentProfile = typeof demoStudentProfile

type Enrollment = (typeof defaultEnrollments)[number]

type SignInPayload = {
  email: string
  password: string
}

type SignUpPayload = SignInPayload & {
  fullName: string
  interest?: string
  schoolId?: string
}

type OnboardingPayload = {
  language: string
  learningGoals: string
  availability: string
  interests: string[]
  accessibility: string[]
  preferredMode: 'online' | 'offline' | 'hybrid'
}

type StudentJourneyContextValue = {
  isAuthenticated: boolean
  profileComplete: boolean
  student: StudentProfile | null
  enrollments: Enrollment[]
  notifications: number
  loading: boolean
  error: string | null
  signIn: (payload: SignInPayload) => Promise<void>
  signUp: (payload: SignUpPayload) => Promise<void>
  signOut: () => void
  completeOnboarding: (payload: OnboardingPayload) => void
  recordLessonView: (courseId: string, lessonId: string, progress: number) => void
  clearError: () => void
}

const STORAGE_KEY = 'mrict:student:journey'

const StudentJourneyContext = createContext<StudentJourneyContextValue | undefined>(undefined)

type PersistedState = {
  isAuthenticated: boolean
  profileComplete: boolean
  student: StudentProfile | null
  enrollments: Enrollment[]
  notifications: number
}

type ComponentState = PersistedState & {
  loading: boolean
  error: string | null
}

const defaultState: ComponentState = {
  isAuthenticated: false,
  profileComplete: false,
  student: null,
  enrollments: [],
  notifications: 0,
  loading: false,
  error: null,
}

function loadInitialState(): ComponentState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Check if we have tokens - if so, we should be authenticated
    const hasTokens = tokenManager.hasTokens()
    return { ...defaultState, isAuthenticated: hasTokens }
  }

  try {
    const parsed = JSON.parse(stored) as PersistedState
    return { ...defaultState, ...parsed }
  } catch (error) {
    console.warn('Failed to parse journey state', error)
    return defaultState
  }
}

export function StudentJourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ComponentState>(loadInitialState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Only persist non-transient state
    const { loading, error, ...persistedState } = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState))
  }, [state])

  // Load profile on mount if authenticated
  useEffect(() => {
    const shouldLoadProfile = state.isAuthenticated && !state.student && !state.loading
    
    if (shouldLoadProfile) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const loadProfile = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const response = await profileApi.getProfile()
      const profileData = response.data
      
      setState((prev) => ({
        ...prev,
        loading: false,
        student: {
          ...demoStudentProfile,
          email: profileData.email,
          fullName: `${profileData.first_name} ${profileData.last_name}`,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          language: profileData.preferred_language || 'English',
          interests: profileData.interest_tags || [],
          accessibility: profileData.accessibility_preferences || [],
        },
        profileComplete: profileData.has_completed_onboarding,
      }))
    } catch (error) {
      console.error('Failed to load profile:', error)
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  const signIn = useCallback(async (payload: SignInPayload) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      
      const response = await authApi.signIn(payload.email, payload.password)
      const { access, refresh } = response.data
      
      // Store tokens
      tokenManager.setTokens(access, refresh)
      
      // Load profile
      const profileResponse = await profileApi.getProfile()
      const profileData = profileResponse.data
      
      setState({
        isAuthenticated: true,
        profileComplete: profileData.has_completed_onboarding,
        student: {
          ...demoStudentProfile,
          email: profileData.email,
          fullName: `${profileData.first_name} ${profileData.last_name}`,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          language: profileData.preferred_language || 'English',
          interests: profileData.interest_tags || [],
          accessibility: profileData.accessibility_preferences || [],
        },
        enrollments: state.enrollments.length ? state.enrollments : defaultEnrollments,
        notifications: 6,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      const errorMessage = apiError?.detail || apiError?.message || 'Sign in failed. Please check your credentials.'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }, [])

  const signUp = useCallback(async (payload: SignUpPayload) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      
      const [firstName, ...rest] = payload.fullName.split(' ')
      const lastName = rest.join(' ')
      
      // Use provided school ID or fallback to default
      const schoolId = payload.schoolId || import.meta.env.VITE_DEFAULT_SCHOOL_ID || 'SCH-0JP0Z5GR-OL'
      
      const response = await authApi.signUp({
        email: payload.email,
        password: payload.password,
        password2: payload.password, // Confirm password
        first_name: firstName,
        last_name: lastName || 'Student', // Provide default if no last name
        phone: '', // Optional - can be added to form later
        country: 'Ghana', // Default country
        school_id: schoolId, // Use provided or default school
      })
      
      const { access, refresh } = response.data
      
      // Store tokens
      tokenManager.setTokens(access, refresh)
      
      // Load profile
      const profileResponse = await profileApi.getProfile()
      const profileData = profileResponse.data
      
      setState({
        isAuthenticated: true,
        profileComplete: false,
        student: {
          ...demoStudentProfile,
          email: profileData.email,
          fullName: `${profileData.first_name} ${profileData.last_name}`,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          interests: payload.interest ? [payload.interest] : [],
        },
        enrollments: [],
        notifications: 3,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      const apiError = error.response?.data as ApiError
      const errorMessage = apiError?.errors 
        ? Object.values(apiError.errors).flat().join(' ')
        : apiError?.detail || apiError?.message || 'Sign up failed. Please try again.'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    tokenManager.clearTokens()
    setState(defaultState)
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const completeOnboarding = useCallback((payload: OnboardingPayload) => {
    setState((current) => {
      if (!current.student) return current
      return {
        ...current,
        profileComplete: true,
        student: {
          ...current.student!,
          language: payload.language,
          learningGoals: payload.learningGoals,
          availability: payload.availability,
          interests: payload.interests,
          accessibility: payload.accessibility,
          preferredMode: payload.preferredMode,
        },
        enrollments: current.enrollments.length ? current.enrollments : defaultEnrollments,
        notifications: current.notifications + 2,
      }
    })
  }, [])

  const recordLessonView = useCallback((courseId: string, lessonId: string, progress: number) => {
    setState((current) => {
      const enrollments = current.enrollments.length ? current.enrollments : defaultEnrollments
      const nextEnrollments = enrollments.map((enrollment) => {
        if (enrollment.courseId !== courseId) return enrollment
        return {
          ...enrollment,
          progress: Math.min(100, Math.max(enrollment.progress, progress)),
          lastLessonId: lessonId,
        }
      })
      return { ...current, enrollments: nextEnrollments }
    })
  }, [])

  const value = useMemo<StudentJourneyContextValue>(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      completeOnboarding,
      recordLessonView,
      clearError,
    }),
    [state],
  )

  return <StudentJourneyContext.Provider value={value}>{children}</StudentJourneyContext.Provider>
}

export function useStudentJourney() {
  const context = useContext(StudentJourneyContext)
  if (!context) {
    throw new Error('useStudentJourney must be used inside StudentJourneyProvider')
  }
  return context
}
