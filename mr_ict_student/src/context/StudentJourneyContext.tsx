import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { demoStudentProfile, enrollments as defaultEnrollments } from '../data/mockData'

type StudentProfile = typeof demoStudentProfile

type Enrollment = (typeof defaultEnrollments)[number]

type SignInPayload = {
  email: string
  password: string
}

type SignUpPayload = SignInPayload & {
  fullName: string
  interest?: string
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
  signIn: (payload: SignInPayload) => void
  signUp: (payload: SignUpPayload) => void
  signOut: () => void
  completeOnboarding: (payload: OnboardingPayload) => void
  recordLessonView: (courseId: string, lessonId: string, progress: number) => void
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

const defaultState: PersistedState = {
  isAuthenticated: false,
  profileComplete: false,
  student: null,
  enrollments: [],
  notifications: 0,
}

function loadInitialState(): PersistedState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return defaultState
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
  const [state, setState] = useState<PersistedState>(loadInitialState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const signIn = (payload: SignInPayload) => {
    const profile = {
      ...demoStudentProfile,
      email: payload.email,
      fullName: demoStudentProfile.fullName,
    }
    setState({
      isAuthenticated: true,
      profileComplete: state.profileComplete,
      student: profile,
      enrollments: state.enrollments.length ? state.enrollments : defaultEnrollments,
      notifications: 6,
    })
  }

  const signUp = (payload: SignUpPayload) => {
    const [firstName, ...rest] = payload.fullName.split(' ')
    const profile = {
      ...demoStudentProfile,
      email: payload.email,
      fullName: payload.fullName,
      firstName,
      lastName: rest.join(' '),
      interests: payload.interest ? [payload.interest] : demoStudentProfile.interests,
    }
    setState({
      isAuthenticated: true,
      profileComplete: false,
      student: profile,
      enrollments: [],
      notifications: 3,
    })
  }

  const signOut = () => {
    setState(defaultState)
  }

  const completeOnboarding = (payload: OnboardingPayload) => {
    if (!state.student) return
    setState((current) => ({
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
    }))
  }

  const recordLessonView = (courseId: string, lessonId: string, progress: number) => {
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
  }

  const value = useMemo<StudentJourneyContextValue>(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      completeOnboarding,
      recordLessonView,
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
