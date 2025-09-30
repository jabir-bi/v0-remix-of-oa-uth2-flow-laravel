// API Client - Handles authenticated requests to Laravel backend
import { getAuthSession, isTokenExpired } from "@/lib/auth/session"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
  autoRefresh?: boolean
}

/**
 * Makes an authenticated API request to the Laravel backend
 * Automatically handles token refresh if needed
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, autoRefresh = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  headers.set("Accept", "application/json")
  headers.set("Content-Type", "application/json")

  // Add authentication token if required
  if (requiresAuth) {
    const session = await getAuthSession()

    if (!session) {
      throw new ApiError("Not authenticated", 401)
    }

    // Check if token is expired and refresh if needed
    if (autoRefresh && isTokenExpired(session.expiresAt)) {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      if (!refreshResponse.ok) {
        throw new ApiError("Session expired", 401)
      }

      // Get updated session after refresh
      const updatedSession = await getAuthSession()
      if (!updatedSession) {
        throw new ApiError("Session refresh failed", 401)
      }

      headers.set("Authorization", `${updatedSession.tokenType} ${updatedSession.accessToken}`)
    } else {
      headers.set("Authorization", `${session.tokenType} ${session.accessToken}`)
    }
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  })

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type")
  const isJson = contentType?.includes("application/json")

  if (!response.ok) {
    const errorData = isJson ? await response.json().catch(() => ({})) : {}
    throw new ApiError(errorData.message || `Request failed with status ${response.status}`, response.status, errorData)
  }

  // Return empty object for 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return isJson ? response.json() : response.text()
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" })
}

/**
 * POST request helper
 */
export async function apiPost<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" })
}
