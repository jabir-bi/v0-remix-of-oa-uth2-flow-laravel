// User Info Handler - Fetches current user data from Laravel
import { type NextRequest, NextResponse } from "next/server"
import { getAuthSession, isTokenExpired } from "@/lib/auth/session"
import { authConfig } from "@/lib/auth/config"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if token is expired
    if (isTokenExpired(session.expiresAt)) {
      // Attempt to refresh token
      const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url), {
        method: "POST",
      })

      if (!refreshResponse.ok) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 })
      }

      // Get updated session after refresh
      const updatedSession = await getAuthSession()
      if (!updatedSession) {
        return NextResponse.json({ error: "Session refresh failed" }, { status: 401 })
      }

      session.accessToken = updatedSession.accessToken
      session.tokenType = updatedSession.tokenType
    }

    // Fetch user info from Laravel
    const userResponse = await fetch(authConfig.userInfoEndpoint, {
      headers: {
        Authorization: `${session.tokenType} ${session.accessToken}`,
        Accept: "application/json",
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: userResponse.status })
    }

    const user = await userResponse.json()

    return NextResponse.json(user)
  } catch (error) {
    console.error("[User Info Error]", error)
    return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 })
  }
}
