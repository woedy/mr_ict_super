import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('kwame@example.com')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enter the email linked to your Mr ICT Student account. We will send a reset link and tips for staying secure in ICT labs.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
          >
            Email me instructions
          </button>
        </form>
        {submitted ? (
          <p className="mt-6 rounded-2xl bg-primary-500/10 p-4 text-sm text-primary-700 dark:text-primary-200">
            We just sent a reset email to <span className="font-semibold">{email}</span>. Check your inbox or spam folder. For ICT labs,
            encourage your facilitator to help you complete the reset.
          </p>
        ) : null}
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Remembered your password?{' '}
          <Link to="/signin" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
            Return to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
