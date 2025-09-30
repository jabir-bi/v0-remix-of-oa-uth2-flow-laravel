// Logout Handler - Revokes tokens and clears session
import { type NextRequest, NextResponse } from "next/server"
import { getAuthSession, clearAuthSession } from "@/lib/auth/session"
import { authConfig } from "@/lib/auth/config"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (session) {
      // Revoke tokens on Laravel backend
      try {
        await fetch(authConfig.logoutEndpoint, {
          method: "POST",
          headers: {
            Authorization: `${session.tokenType} ${session.accessToken}`,
            Accept: "application/json",
          },
        })
      } catch (error) {
        console.error("[Token Revocation Error]", error)
        // Continue with local logout even if revocation fails
      }
    }

    // Clear local session
    await clearAuthSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Logout Error]", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
