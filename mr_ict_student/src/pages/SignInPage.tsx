import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { useStudentJourney } from '../context/StudentJourneyContext'

export function SignInPage() {
  const { signIn, isAuthenticated, profileComplete, loading, error: contextError, clearError } = useStudentJourney()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const redirectState = location.state as { from?: { pathname?: string } } | null
      const redirectTo = redirectState?.from?.pathname
      navigate(redirectTo ?? (profileComplete ? '/dashboard' : '/onboarding'), { replace: true })
    }
  }, [isAuthenticated, profileComplete, navigate, location.state])

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

    if (!email || !password) {
      setLocalError('Enter your email and password to continue.')
      return
    }

    try {
      await signIn({ email, password })
      // Navigation handled by useEffect above
    } catch (error) {
      // Error is handled in context and displayed via contextError
      console.error('Sign in error:', error)
    }
  }

  const displayError = localError || contextError

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-12">
        <div className="hidden w-1/2 max-w-xl rounded-3xl bg-gradient-to-br from-primary-500 via-accent-400 to-primary-600 p-[1px] shadow-xl lg:block">
          <div className="h-full rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-900/95 p-10 text-white">
            <ThemeToggle />
            <div className="mt-12 space-y-6">
              <h1 className="text-4xl font-semibold leading-tight">
                Welcome back to the studio. Your community is waiting.
              </h1>
              <p className="text-sm text-white/70">
                Continue your interactive lessons, contribute to community resources, and gather XP for your ICT
                club across Ghana and Africa.
              </p>
              <div className="space-y-4 text-sm text-white/80">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary-200">Next up</p>
                  <p className="mt-1 font-semibold">Finish “Responsive Grids for Mobile-First Schools”</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary-200">Community prompt</p>
                  <p className="mt-1">
                    Share how you adapt code walkthroughs when the projector fails — help another ICT club thrive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Mr ICT Student</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Sign in to continue</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Access your dashboard, offline packs, and coding sandboxes.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                placeholder="••••••••"
              />
              <div className="mt-2 text-right text-xs">
                <Link to="/forgot-password" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            {displayError ? <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in and continue'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            New to Mr ICT Student?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
