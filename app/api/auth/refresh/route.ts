// Token Refresh Handler - Exchanges refresh token for new access token
import { type NextRequest, NextResponse } from "next/server"
import { getAuthSession, setAuthSession, clearAuthSession } from "@/lib/auth/session"
import { authConfig } from "@/lib/auth/config"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.refreshToken) {
      return NextResponse.json({ error: "No refresh token available" }, { status: 401 })
    }

    // Exchange refresh token for new tokens
    const tokenResponse = await fetch(authConfig.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
        client_id: authConfig.clientId,
      }),
    })

    if (!tokenResponse.ok) {
      // Refresh token is invalid or expired, clear session
      await clearAuthSession()
      return NextResponse.json({ error: "Token refresh failed" }, { status: 401 })
    }

    const tokens = await tokenResponse.json()

    // Calculate new expiration time
    const expiresAt = Date.now() + tokens.expires_in * 1000

    // Update session with new tokens
    await setAuthSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      tokenType: tokens.token_type || "Bearer",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Token Refresh Error]", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}
