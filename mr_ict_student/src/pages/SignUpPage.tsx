import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'
import { schoolsApi } from '../lib/api'

const interestOptions = [
  'Web storytelling',
  'Data for communities',
  'Inclusive design',
  'Creative coding',
]

export function SignUpPage() {
  const { signUp, isAuthenticated, profileComplete, loading, error: contextError, clearError } = useStudentJourney()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [interest, setInterest] = useState(interestOptions[0])
  const [schoolId, setSchoolId] = useState('')
  const [schools, setSchools] = useState<any[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)

  // Load schools on mount
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoadingSchools(true)
        const response = await schoolsApi.getSchools()
        const schoolsData = response.data?.schools || []
        setSchools(schoolsData)
        // Set first school as default if available
        if (schoolsData.length > 0) {
          setSchoolId(schoolsData[0].school_id)
        }
      } catch (error) {
        console.error('Failed to load schools:', error)
        // Use default school ID as fallback
        setSchoolId('SCH-0JP0Z5GR-OL')
      } finally {
        setLoadingSchools(false)
      }
    }
    loadSchools()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(profileComplete ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [isAuthenticated, profileComplete, navigate])

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)
    clearError()

    if (!fullName || !email || !password || !schoolId) {
      setLocalError('Fill in all your details to join the studio.')
      return
    }

    // Validate password strength (must match backend requirements)
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.')
      return
    }
    
    if (!/[A-Z]/.test(password)) {
      setLocalError('Password must include at least one uppercase letter.')
      return
    }
    
    if (!/[a-z]/.test(password)) {
      setLocalError('Password must include at least one lowercase letter.')
      return
    }
    
    if (!/[0-9]/.test(password)) {
      setLocalError('Password must include at least one number.')
      return
    }
    
    if (!/[-!@#$%^&*_()+=\/.,<>?"~`£{}|:;]/.test(password)) {
      setLocalError('Password must include at least one special character (!@#$%^&*).')
      return
    }

    try {
      await signUp({ fullName, email, password, interest, schoolId })
      // Navigation handled by useEffect above
    } catch (error) {
      // Error is handled in context and displayed via contextError
      console.error('Sign up error:', error)
    }
  }

  const displayError = localError || contextError

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl rounded-[3rem] border border-slate-200 bg-white/80 p-[1px] shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white p-10 dark:bg-slate-950/90">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
                Mr ICT Student beta cohort
              </span>
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                Reimagine ICT learning for your community.
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Create an account to access immersive video coding lessons, African-inspired projects, and a welcoming student
                community ready to collaborate.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                  Interactive coding timeline player
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                  Offline lesson packs for ICT labs
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                  Community review circles and XP rewards
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900/90">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create your account</h2>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    placeholder="Ama Serwaa"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Choose password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    placeholder="Create a secure passphrase"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Must be 8+ characters with uppercase, lowercase, number, and special character (!@#$%^&*)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Select your school</label>
                  <select
                    value={schoolId}
                    onChange={(event) => setSchoolId(event.target.value)}
                    disabled={loadingSchools}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 disabled:opacity-50"
                  >
                    {loadingSchools ? (
                      <option>Loading schools...</option>
                    ) : schools.length > 0 ? (
                      schools.map((school) => (
                        <option key={school.school_id} value={school.school_id}>
                          {school.name}
                        </option>
                      ))
                    ) : (
                      <option value="SCH-0JP0Z5GR-OL">Mr ICT Academy (Default)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Pick your focus area</label>
                  <select
                    value={interest}
                    onChange={(event) => setInterest(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {interestOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {displayError ? <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p> : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Join Mr ICT Student'}
                </button>
              </form>
              <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
                Already learning with us?{' '}
                <Link to="/signin" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
