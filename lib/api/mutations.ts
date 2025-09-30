// API mutation helpers for data modification operations
"use client"

import { userApi, sessionApi, tokenApi } from "./laravel"
import { mutate } from "swr"
import type { User } from "./laravel"

/**
 * Update user data
 */
export async function updateUser(id: string, data: Partial<User>) {
  const result = await userApi.update(id, data)
  // Revalidate user data
  await mutate(`user-${id}`)
  await mutate("current-user")
  return result
}

/**
 * Delete user
 */
export async function deleteUser(id: string) {
  await userApi.delete(id)
  // Revalidate users list
  await mutate((key) => typeof key === "string" && key.startsWith("users-"))
}

/**
 * Update user permissions
 */
export async function updateUserPermissions(id: string, permissions: string[]) {
  const result = await userApi.updatePermissions(id, permissions)
  // Revalidate user data
  await mutate(`user-${id}`)
  await mutate((key) => typeof key === "string" && key.startsWith("users-"))
  return result
}

/**
 * Revoke a session
 */
export async function revokeSession(sessionId: string) {
  await sessionApi.revoke(sessionId)
  // Revalidate sessions
  await mutate("sessions")
}

/**
 * Revoke all sessions except current
 */
export async function revokeAllSessions() {
  await sessionApi.revokeAll()
  // Revalidate sessions
  await mutate("sessions")
}

/**
 * Revoke a token
 */
export async function revokeToken(tokenId: string) {
  await tokenApi.revoke(tokenId)
  // Revalidate tokens
  await mutate("tokens")
}

/**
 * Revoke all tokens
 */
export async function revokeAllTokens() {
  await tokenApi.revokeAll()
  // Revalidate tokens
  await mutate("tokens")
}
