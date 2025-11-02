/**
 * API Client for Mr ICT Student App
 * Handles all HTTP requests to the backend with JWT authentication
 */

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Token storage keys
const ACCESS_TOKEN_KEY = 'mrict_access_token'
const REFRESH_TOKEN_KEY = 'mrict_refresh_token'

/**
 * Token Management
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasTokens: (): boolean => {
    return !!tokenManager.getAccessToken() && !!tokenManager.getRefreshToken()
  },
}

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  })

  // Request interceptor - Add auth token to requests
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - Handle token refresh on 401
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = tokenManager.getRefreshToken()
          
          if (!refreshToken) {
            // No refresh token, redirect to login
            tokenManager.clearTokens()
            window.location.href = '/sign-in'
            return Promise.reject(error)
          }

          // Attempt to refresh the token
          const response = await axios.post(`${API_BASE_URL}/api/accounts/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data

          // Update tokens
          tokenManager.setTokens(access, refreshToken)

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`
          }

          return client(originalRequest)
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          tokenManager.clearTokens()
          window.location.href = '/sign-in'
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

/**
 * Main API client instance
 */
export const apiClient = createApiClient()

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  message: string
  data: T
}

export interface ApiError {
  message?: string
  errors?: Record<string, string[]>
  detail?: string
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse>('/api/accounts/login-student/', {
      email,
      password,
      fcm_token: 'web-client-token', // Placeholder for web client
    })
    return response.data
  },

  /**
   * Sign up new student
   */
  signUp: async (data: {
    email: string
    password: string
    password2: string
    first_name: string
    last_name: string
    phone: string
    country: string
    school_id: string
  }) => {
    const response = await apiClient.post<ApiResponse>('/api/accounts/register-student/', data)
    return response.data
  },

  /**
   * Verify JWT token
   */
  verifyToken: async (token: string) => {
    const response = await apiClient.post('/api/accounts/token/verify/', { token })
    return response.data
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/api/accounts/token/refresh/', {
      refresh: refreshToken,
    })
    return response.data
  },
}

/**
 * Student Profile API
 */
export const profileApi = {
  /**
   * Get current student profile
   */
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse>('/api/students/experience/me/')
    return response.data
  },

  /**
   * Update student profile
   */
  updateProfile: async (data: {
    preferred_language?: string
    accessibility_preferences?: string[]
    interest_tags?: string[]
    allow_offline_downloads?: boolean
  }) => {
    const response = await apiClient.patch<ApiResponse>('/api/students/experience/me/', data)
    return response.data
  },

  /**
   * Complete onboarding
   */
  completeOnboarding: async (data: {
    preferred_language: string
    accessibility_preferences: string[]
    interest_tags: string[]
    complete_onboarding: boolean
  }) => {
    const response = await apiClient.patch<ApiResponse>('/api/students/experience/me/', data)
    return response.data
  },
}

/**
 * Courses API
 */
export const coursesApi = {
  /**
   * Get course catalog
   */
  getCatalog: async (params?: { page?: number; page_size?: number; search?: string }) => {
    const response = await apiClient.get<ApiResponse>('/api/students/experience/catalog/', {
      params,
    })
    return response.data
  },

  /**
   * Get course details
   */
  getCourseDetail: async (courseId: string) => {
    const response = await apiClient.get<ApiResponse>(
      `/api/students/experience/catalog/${courseId}/`
    )
    return response.data
  },

  /**
   * Enroll in a course
   */
  enrollCourse: async (courseId: string) => {
    const response = await apiClient.post<ApiResponse>(
      `/api/students/experience/catalog/${courseId}/enroll/`
    )
    return response.data
  },
}

/**
 * Dashboard API
 */
export const dashboardApi = {
  /**
   * Get student dashboard data
   */
  getDashboard: async () => {
    const response = await apiClient.get<ApiResponse>('/api/students/experience/dashboard/')
    return response.data
  },
}

/**
 * Lessons API
 */
export const lessonsApi = {
  /**
   * Get lesson playback data
   */
  getLessonPlayback: async (lessonId: string) => {
    const response = await apiClient.get<ApiResponse>(
      `/api/students/experience/lessons/${lessonId}/`
    )
    return response.data
  },

  /**
   * Update lesson progress
   */
  updateProgress: async (
    lessonId: string,
    data: { last_position_seconds: number; completed?: boolean }
  ) => {
    const response = await apiClient.patch<ApiResponse>(
      `/api/students/experience/lessons/${lessonId}/progress/`,
      data
    )
    return response.data
  },
}

/**
 * Schools API
 */
export const schoolsApi = {
  /**
   * Get all schools
   */
  getSchools: async (params?: { search?: string; page?: number }) => {
    const response = await apiClient.get<ApiResponse>('/api/schools/get-all-schools/', { params })
    return response.data
  },
}

/**
 * Export default client
 */
export default apiClient
