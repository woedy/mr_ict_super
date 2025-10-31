import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'

const interestOptions = [
  'Web storytelling',
  'Data for communities',
  'Inclusive design',
  'Creative coding',
]

export function SignUpPage() {
  const { signUp, isAuthenticated, profileComplete } = useStudentJourney()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('Ama Serwaa')
  const [email, setEmail] = useState('ama@example.com')
  const [password, setPassword] = useState('createICT!')
  const [interest, setInterest] = useState(interestOptions[0])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(profileComplete ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [isAuthenticated, profileComplete, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!fullName || !email || !password) {
      setError('Fill in your details to join the studio.')
      return
    }
    setError(null)
    signUp({ fullName, email, password, interest })
  }

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
                Create an account to access immersive video coding lessons, Ghana-inspired projects, and a welcoming student
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
                {error ? <p className="text-sm text-accent-500">{error}</p> : null}
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
                >
                  Join Mr ICT Student
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
