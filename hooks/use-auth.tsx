"use client"

// Authentication Hook - Provides auth state and methods to React components
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user")

      if (response.ok) {
        const userData = await response.json()
        console.log("[v0] User fetched successfully:", userData)
        setUser(userData)
      } else {
        setUser(null)
        if (response.status !== 401) {
          console.error("[Auth] Failed to fetch user:", response.status, response.statusText)
        }
      }
    } catch (error) {
      console.error("[Auth] Network error fetching user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log("[v0] AuthProvider mounted, fetching user...")
    fetchUser()
  }, [fetchUser])

  const login = useCallback(() => {
    // Redirect to login API route which initiates OAuth2 flow
    window.location.href = "/api/auth/login"
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("[Auth] Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
