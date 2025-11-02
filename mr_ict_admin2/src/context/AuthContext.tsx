import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { tokenManager } from '../lib/api'

interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has valid tokens
    const hasTokens = tokenManager.hasTokens()
    setIsAuthenticated(hasTokens)
    setLoading(false)
  }, [])

  const signIn = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const signOut = useCallback(() => {
    tokenManager.clearTokens()
    setIsAuthenticated(false)
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
