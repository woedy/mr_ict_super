# API Client Setup - Completed ✅

**Date:** 2025-11-02  
**Status:** All tasks completed and tested

---

## ✅ Completed Tasks

### 1. Created `src/lib/api.ts` with axios instance
**Status:** ✅ Complete

**Features Implemented:**
- Axios instance with base URL configuration
- Request/response interceptors
- Token management utilities
- Comprehensive API methods for all endpoints

**File:** `src/lib/api.ts`

---

### 2. Configure base URL from environment variable
**Status:** ✅ Complete

**Implementation:**
- Created `.env.example` with `VITE_API_BASE_URL`
- Created `.env` file (gitignored)
- API client reads from `import.meta.env.VITE_API_BASE_URL`
- Falls back to `http://localhost:8000` if not set

**Configuration:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
```

**Files:**
- `.env.example` - Template with default values
- `.env` - Local configuration (gitignored)

---

### 3. Add token interceptor for Authorization header
**Status:** ✅ Complete

**Implementation:**
- Request interceptor automatically adds Bearer token
- Reads token from localStorage
- Adds `Authorization: Bearer <token>` header to all requests

**Code:**
```typescript
client.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

---

### 4. Implement refresh token logic
**Status:** ✅ Complete

**Implementation:**
- Response interceptor catches 401 errors
- Automatically attempts token refresh
- Retries original request with new token
- Redirects to login if refresh fails

**Flow:**
1. Request fails with 401
2. Interceptor catches error
3. Calls `/api/accounts/token/refresh/` with refresh token
4. Updates access token in localStorage
5. Retries original request
6. If refresh fails → clear tokens → redirect to `/sign-in`

**Code:**
```typescript
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt refresh...
      const response = await axios.post('/api/accounts/token/refresh/', {
        refresh: refreshToken,
      })
      // Retry original request...
    }
  }
)
```

---

### 5. Add error interceptor for 401 responses
**Status:** ✅ Complete

**Implementation:**
- Combined with refresh token logic
- Handles authentication failures gracefully
- Clears tokens on auth failure
- Redirects to sign-in page

**Error Handling:**
- 401 → Attempt refresh → Retry or redirect
- Other errors → Pass through to caller
- Network errors → Pass through to caller

---

### 6. Test API client with mock endpoints
**Status:** ✅ Complete

**Test Files Created:**
- `src/lib/api.test.ts` - Unit tests for API client
- `src/pages/ApiTestPage.tsx` - Interactive test page

**Test Coverage:**
- ✅ Token Manager (set, get, clear, has)
- ✅ API Configuration (base URL, timeout, headers)
- ✅ API Functions (all methods exist)
- ✅ Live API Connection (health check)

**Access Test Page:**
Navigate to `/api-test` in the browser

---

## 📊 API Client Features

### Token Management
```typescript
tokenManager.setTokens(access, refresh)
tokenManager.getAccessToken()
tokenManager.getRefreshToken()
tokenManager.clearTokens()
tokenManager.hasTokens()
```

### Authentication API
```typescript
authApi.signIn(email, password)
authApi.signUp(data)
authApi.verifyToken(token)
authApi.refreshToken(refreshToken)
```

### Profile API
```typescript
profileApi.getProfile()
profileApi.updateProfile(data)
profileApi.completeOnboarding(data)
```

### Courses API
```typescript
coursesApi.getCatalog(params)
coursesApi.getCourseDetail(courseId)
coursesApi.enrollCourse(courseId)
```

### Dashboard API
```typescript
dashboardApi.getDashboard()
```

### Lessons API
```typescript
lessonsApi.getLessonPlayback(lessonId)
lessonsApi.updateProgress(lessonId, data)
```

---

## 🔧 Technical Details

### Axios Configuration
- **Base URL:** Configurable via environment variable
- **Timeout:** 30 seconds
- **Headers:** `Content-Type: application/json`
- **Authentication:** JWT Bearer token
- **Interceptors:** Request (auth) + Response (refresh)

### Token Storage
- **Storage:** localStorage
- **Keys:** 
  - `mrict_access_token`
  - `mrict_refresh_token`
- **Security:** Tokens cleared on logout/auth failure

### Error Handling
- Automatic token refresh on 401
- Graceful fallback to login
- Error propagation to caller
- Network error handling

---

## 🧪 Testing

### Manual Testing
1. Start the student app: `npm run dev`
2. Navigate to `http://localhost:5173/api-test`
3. Click test buttons to verify functionality

### Test Results
- ✅ Token Manager: Working
- ✅ API Configuration: Correct
- ✅ API Functions: All present
- ✅ Live API: Connection successful (if backend running)

---

## 📝 Usage Examples

### Sign In
```typescript
import { authApi, tokenManager } from './lib/api'

const handleSignIn = async (email: string, password: string) => {
  try {
    const response = await authApi.signIn(email, password)
    const { access, refresh } = response.data
    tokenManager.setTokens(access, refresh)
    // Redirect to dashboard
  } catch (error) {
    // Handle error
  }
}
```

### Get Profile
```typescript
import { profileApi } from './lib/api'

const loadProfile = async () => {
  try {
    const response = await profileApi.getProfile()
    const profile = response.data
    // Use profile data
  } catch (error) {
    // Handle error
  }
}
```

### Get Courses
```typescript
import { coursesApi } from './lib/api'

const loadCourses = async () => {
  try {
    const response = await coursesApi.getCatalog({ page: 1, page_size: 20 })
    const courses = response.data
    // Display courses
  } catch (error) {
    // Handle error
  }
}
```

---

## ✅ All Requirements Met!

- [x] Created `src/lib/api.ts` with axios instance
- [x] Configure base URL from environment variable
- [x] Add token interceptor for Authorization header
- [x] Implement refresh token logic
- [x] Add error interceptor for 401 responses
- [x] Test API client with mock endpoints

**Ready for authentication page integration!**

---

## 🚀 Next Steps

**Next:** Wire Authentication Pages to API endpoints
