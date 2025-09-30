// Session management utilities
import { cookies } from "next/headers"
import { cookieConfig } from "./config"

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
  tokenType: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

/**
 * Stores authentication session in httpOnly cookies
 */
export async function setAuthSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(cookieConfig.authSession, JSON.stringify(session), {
    httpOnly: true,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    maxAge: cookieConfig.maxAge,
    path: cookieConfig.path,
  })
}

/**
 * Retrieves authentication session from cookies
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(cookieConfig.authSession)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as AuthSession
  } catch {
    return null
  }
}

/**
 * Clears authentication session from cookies
 */
export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(cookieConfig.authSession)
}

/**
 * Checks if the access token is expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt
}
