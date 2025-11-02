/**
 * API Test Page
 * Simple page to test API client functionality
 */

import { useState } from 'react'
import { tokenManager, authApi, profileApi, coursesApi, apiClient } from '../lib/api'

export default function ApiTestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message])
  }

  const clearResults = () => {
    setResults([])
  }

  // Test 1: Token Manager
  const testTokenManager = () => {
    clearResults()
    addResult('🧪 Testing Token Manager...')

    tokenManager.setTokens('test_access', 'test_refresh')
    addResult('✅ Set tokens')

    const access = tokenManager.getAccessToken()
    const refresh = tokenManager.getRefreshToken()
    addResult(`✅ Get access token: ${access?.substring(0, 20)}...`)
    addResult(`✅ Get refresh token: ${refresh?.substring(0, 20)}...`)

    const hasTokens = tokenManager.hasTokens()
    addResult(`✅ Has tokens: ${hasTokens}`)

    tokenManager.clearTokens()
    addResult('✅ Cleared tokens')

    const hasTokensAfter = tokenManager.hasTokens()
    addResult(`✅ Has tokens after clear: ${hasTokensAfter}`)
  }

  // Test 2: API Base URL
  const testApiConfig = () => {
    clearResults()
    addResult('🧪 Testing API Configuration...')
    addResult(`✅ Base URL: ${apiClient.defaults.baseURL}`)
    addResult(`✅ Timeout: ${apiClient.defaults.timeout}ms`)
    addResult(`✅ Content-Type: ${apiClient.defaults.headers['Content-Type']}`)
  }

  // Test 3: API Functions Exist
  const testApiFunctions = () => {
    clearResults()
    addResult('🧪 Testing API Functions...')

    const functions = [
      { name: 'authApi.signIn', fn: authApi.signIn },
      { name: 'authApi.signUp', fn: authApi.signUp },
      { name: 'profileApi.getProfile', fn: profileApi.getProfile },
      { name: 'profileApi.updateProfile', fn: profileApi.updateProfile },
      { name: 'coursesApi.getCatalog', fn: coursesApi.getCatalog },
      { name: 'coursesApi.getCourseDetail', fn: coursesApi.getCourseDetail },
    ]

    functions.forEach(({ name, fn }) => {
      addResult(`✅ ${name}: ${typeof fn === 'function' ? 'exists' : 'missing'}`)
    })
  }

  // Test 4: Live API Call (Health Check)
  const testLiveApi = async () => {
    clearResults()
    setLoading(true)
    addResult('🧪 Testing Live API Connection...')

    try {
      // Try to hit a public endpoint (health check or similar)
      const response = await fetch(`${apiClient.defaults.baseURL}/health/`)
      const data = await response.json()
      addResult(`✅ API is reachable: ${response.status}`)
      addResult(`✅ Response: ${JSON.stringify(data).substring(0, 100)}...`)
    } catch (error) {
      addResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Client Test Page</h1>
          <p className="text-gray-600 mb-8">Test the API client functionality</p>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={testTokenManager}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Test Token Manager
            </button>

            <button
              onClick={testApiConfig}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Test API Config
            </button>

            <button
              onClick={testApiFunctions}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Test API Functions
            </button>

            <button
              onClick={testLiveApi}
              disabled={loading}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Live API'}
            </button>
          </div>

          {/* Results */}
          <div className="bg-gray-900 rounded-lg p-6 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Test Results</h2>
              <button
                onClick={clearResults}
                className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 font-mono text-sm">
              {results.length === 0 ? (
                <p className="text-gray-400">Click a test button to see results...</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="text-green-400">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Token Manager: Tests localStorage token operations</li>
              <li>• API Config: Verifies base URL and settings</li>
              <li>• API Functions: Checks if all API methods exist</li>
              <li>• Live API: Tests actual connection to backend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
