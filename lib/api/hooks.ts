// React hooks for API data fetching with SWR
"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { userApi, sessionApi, activityApi, tokenApi, statsApi } from "./laravel"

// SWR fetcher that handles API errors
const fetcher = (fn: () => Promise<any>) => fn()

/**
 * Hook to fetch current user data
 */
export function useCurrentUser(config?: SWRConfiguration) {
  return useSWR("current-user", () => fetcher(userApi.getCurrent), {
    revalidateOnFocus: false,
    ...config,
  })
}

/**
 * Hook to fetch all users (paginated)
 */
export function useUsers(page = 1, perPage = 15, config?: SWRConfiguration) {
  return useSWR(`users-${page}-${perPage}`, () => fetcher(() => userApi.getAll(page, perPage)), {
    revalidateOnFocus: false,
    ...config,
  })
}

/**
 * Hook to fetch user by ID
 */
export function useUser(id: string | null, config?: SWRConfiguration) {
  return useSWR(id ? `user-${id}` : null, () => fetcher(() => userApi.getById(id!)), {
    revalidateOnFocus: false,
    ...config,
  })
}

/**
 * Hook to fetch active sessions
 */
export function useSessions(config?: SWRConfiguration) {
  return useSWR("sessions", () => fetcher(sessionApi.getAll), {
    revalidateOnFocus: true,
    ...config,
  })
}

/**
 * Hook to fetch activity logs
 */
export function useActivityLogs(page = 1, perPage = 20, config?: SWRConfiguration) {
  return useSWR(`activity-logs-${page}-${perPage}`, () => fetcher(() => activityApi.getAll(page, perPage)), {
    revalidateOnFocus: false,
    ...config,
  })
}

/**
 * Hook to fetch user activity logs
 */
export function useUserActivityLogs(userId: string | null, page = 1, perPage = 20, config?: SWRConfiguration) {
  return useSWR(
    userId ? `user-activity-logs-${userId}-${page}-${perPage}` : null,
    () => fetcher(() => activityApi.getByUser(userId!, page, perPage)),
    {
      revalidateOnFocus: false,
      ...config,
    },
  )
}

/**
 * Hook to fetch OAuth2 tokens
 */
export function useTokens(config?: SWRConfiguration) {
  return useSWR("tokens", () => fetcher(tokenApi.getAll), {
    revalidateOnFocus: false,
    ...config,
  })
}

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats(config?: SWRConfiguration) {
  return useSWR("dashboard-stats", () => fetcher(statsApi.getDashboard), {
    refreshInterval: 30000, // Refresh every 30 seconds
    ...config,
  })
}

/**
 * Hook to fetch authentication statistics
 */
export function useAuthStats(config?: SWRConfiguration) {
  return useSWR("auth-stats", () => fetcher(statsApi.getAuth), {
    refreshInterval: 30000, // Refresh every 30 seconds
    ...config,
  })
}
