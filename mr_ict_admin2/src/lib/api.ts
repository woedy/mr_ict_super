/**
 * API Client for Mr ICT Admin App
 * Handles all HTTP requests to the backend with JWT authentication
 */

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Token storage keys
const ACCESS_TOKEN_KEY = 'mrict_admin_access_token'
const REFRESH_TOKEN_KEY = 'mrict_admin_refresh_token'

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
    timeout: 30000,
  })

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - Handle token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = tokenManager.getRefreshToken()
          
          if (!refreshToken) {
            tokenManager.clearTokens()
            window.location.href = '/login'
            return Promise.reject(error)
          }

          const response = await axios.post(`${API_BASE_URL}/api/accounts/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          tokenManager.setTokens(access, refreshToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`
          }

          return client(originalRequest)
        } catch (refreshError) {
          tokenManager.clearTokens()
          window.location.href = '/login'
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
  signIn: async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse>('/api/accounts/login-admin/', {
      email,
      password,
      fcm_token: 'web-admin-token', // Placeholder for web admin
    })
    return response.data
  },

  verifyToken: async (token: string) => {
    const response = await apiClient.post('/api/accounts/token/verify/', { token })
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/api/accounts/token/refresh/', {
      refresh: refreshToken,
    })
    return response.data
  },
}

/**
 * Courses API
 */
export const coursesApi = {
  getCourses: async (params?: { page?: number; page_size?: number; search?: string }) => {
    const response = await apiClient.get<ApiResponse>('/api/admin/content/courses/', { params })
    return response.data
  },

  getCourse: async (courseId: string) => {
    const response = await apiClient.get<ApiResponse>(`/api/courses/${courseId}/`)
    return response.data
  },

  createCourse: async (data: any) => {
    const response = await apiClient.post<ApiResponse>('/api/courses/', data)
    return response.data
  },

  updateCourse: async (courseId: string, data: any) => {
    const response = await apiClient.put<ApiResponse>(`/api/courses/${courseId}/`, data)
    return response.data
  },

  deleteCourse: async (courseId: string) => {
    const response = await apiClient.delete<ApiResponse>(`/api/courses/${courseId}/`)
    return response.data
  },
}

/**
 * Export default client
 */
export default apiClient
