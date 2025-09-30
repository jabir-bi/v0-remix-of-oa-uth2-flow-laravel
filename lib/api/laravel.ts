// Laravel API Client - Type-safe wrappers for Laravel backend endpoints
import { apiGet, apiPost, apiPut, apiDelete } from "./client"
import { authConfig } from "@/lib/auth/config"

// Types
export interface User {
  id: string
  name: string
  email: string
  email_verified_at: string | null
  role: string
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface Session {
  id: string
  user_id: string
  ip_address: string
  user_agent: string
  last_activity: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  description: string
  ip_address: string
  user_agent: string
  created_at: string
}

// User API
export const userApi = {
  /**
   * Get current authenticated user
   */
  getCurrent: () => apiGet<User>(authConfig.userInfoEndpoint),

  /**
   * Get all users (paginated)
   */
  getAll: (page = 1, perPage = 15) =>
    apiGet<PaginatedResponse<User>>(
      `${authConfig.userInfoEndpoint.replace("/api/user", "/api/users")}?page=${page}&per_page=${perPage}`,
    ),

  /**
   * Get user by ID
   */
  getById: (id: string) => apiGet<User>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/users/${id}`)}`),

  /**
   * Update user
   */
  update: (id: string, data: Partial<User>) =>
    apiPut<User>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/users/${id}`)}`, data),

  /**
   * Delete user
   */
  delete: (id: string) => apiDelete<void>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/users/${id}`)}`),

  /**
   * Update user permissions
   */
  updatePermissions: (id: string, permissions: string[]) =>
    apiPut<User>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/users/${id}/permissions`)}`, {
      permissions,
    }),
}

// Session API
export const sessionApi = {
  /**
   * Get all active sessions for current user
   */
  getAll: () => apiGet<Session[]>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/sessions")}`),

  /**
   * Revoke a specific session
   */
  revoke: (sessionId: string) =>
    apiDelete<void>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/sessions/${sessionId}`)}`),

  /**
   * Revoke all sessions except current
   */
  revokeAll: () => apiPost<void>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/sessions/revoke-all")}`),
}

// Activity Log API
export const activityApi = {
  /**
   * Get activity logs (paginated)
   */
  getAll: (page = 1, perPage = 20) =>
    apiGet<PaginatedResponse<ActivityLog>>(
      `${authConfig.userInfoEndpoint.replace("/api/user", "/api/activity-logs")}?page=${page}&per_page=${perPage}`,
    ),

  /**
   * Get activity logs for specific user
   */
  getByUser: (userId: string, page = 1, perPage = 20) =>
    apiGet<PaginatedResponse<ActivityLog>>(
      `${authConfig.userInfoEndpoint.replace("/api/user", `/api/users/${userId}/activity-logs`)}?page=${page}&per_page=${perPage}`,
    ),
}

// OAuth2 Token API
export const tokenApi = {
  /**
   * Get all tokens for current user
   */
  getAll: () => apiGet<any[]>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/oauth/tokens")}`),

  /**
   * Revoke a specific token
   */
  revoke: (tokenId: string) =>
    apiDelete<void>(`${authConfig.userInfoEndpoint.replace("/api/user", `/api/oauth/tokens/${tokenId}`)}`),

  /**
   * Revoke all tokens
   */
  revokeAll: () => apiPost<void>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/oauth/tokens/revoke-all")}`),
}

// Stats API
export const statsApi = {
  /**
   * Get dashboard statistics
   */
  getDashboard: () =>
    apiGet<{
      total_users: number
      active_sessions: number
      auth_requests: number
      database_queries: number
    }>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/stats/dashboard")}`),

  /**
   * Get authentication statistics
   */
  getAuth: () =>
    apiGet<{
      successful_logins: number
      failed_logins: number
      token_refreshes: number
      active_tokens: number
    }>(`${authConfig.userInfoEndpoint.replace("/api/user", "/api/stats/auth")}`),
}
