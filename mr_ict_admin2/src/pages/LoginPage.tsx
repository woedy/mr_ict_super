import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, tokenManager } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      const response = await authApi.signIn(email, password)
      
      if (response.message === 'Successful' && response.data) {
        const { access, refresh } = response.data
        tokenManager.setTokens(access, refresh)
        signIn() // Update auth state
        navigate('/', { replace: true })
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mr ICT Admin</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Sign in to manage your platform</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mr ICT Admin v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
