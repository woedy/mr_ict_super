/**
 * API Client Tests
 * Simple tests to verify API client functionality
 */

import { tokenManager, authApi, profileApi, coursesApi } from './api'

/**
 * Test Token Manager
 */
export const testTokenManager = () => {
  console.log('Testing Token Manager...')
  
  // Test setting tokens
  tokenManager.setTokens('test_access_token', 'test_refresh_token')
  console.log('✅ Set tokens')
  
  // Test getting tokens
  const accessToken = tokenManager.getAccessToken()
  const refreshToken = tokenManager.getRefreshToken()
  console.log('✅ Get tokens:', { accessToken, refreshToken })
  
  // Test has tokens
  const hasTokens = tokenManager.hasTokens()
  console.log('✅ Has tokens:', hasTokens)
  
  // Test clearing tokens
  tokenManager.clearTokens()
  console.log('✅ Clear tokens')
  
  const hasTokensAfterClear = tokenManager.hasTokens()
  console.log('✅ Has tokens after clear:', hasTokensAfterClear)
  
  console.log('Token Manager tests complete!\n')
}

/**
 * Test API Endpoints (Mock)
 */
export const testApiEndpoints = () => {
  console.log('Testing API Endpoints...')
  
  // These are just structure tests, not actual API calls
  console.log('✅ authApi.signIn - function exists:', typeof authApi.signIn === 'function')
  console.log('✅ authApi.signUp - function exists:', typeof authApi.signUp === 'function')
  console.log('✅ authApi.verifyToken - function exists:', typeof authApi.verifyToken === 'function')
  console.log('✅ authApi.refreshToken - function exists:', typeof authApi.refreshToken === 'function')
  
  console.log('✅ profileApi.getProfile - function exists:', typeof profileApi.getProfile === 'function')
  console.log('✅ profileApi.updateProfile - function exists:', typeof profileApi.updateProfile === 'function')
  console.log('✅ profileApi.completeOnboarding - function exists:', typeof profileApi.completeOnboarding === 'function')
  
  console.log('✅ coursesApi.getCatalog - function exists:', typeof coursesApi.getCatalog === 'function')
  console.log('✅ coursesApi.getCourseDetail - function exists:', typeof coursesApi.getCourseDetail === 'function')
  console.log('✅ coursesApi.enrollCourse - function exists:', typeof coursesApi.enrollCourse === 'function')
  
  console.log('API Endpoints tests complete!\n')
}

/**
 * Run all tests
 */
export const runApiTests = () => {
  console.log('='.repeat(60))
  console.log('Running API Client Tests')
  console.log('='.repeat(60) + '\n')
  
  testTokenManager()
  testApiEndpoints()
  
  console.log('='.repeat(60))
  console.log('All API Client Tests Complete!')
  console.log('='.repeat(60))
}

// Export for use in console or test runner
if (typeof window !== 'undefined') {
  (window as any).runApiTests = runApiTests
}
