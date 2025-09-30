// OAuth2 Login Initiation - Redirects to Laravel authorization endpoint
import { type NextRequest, NextResponse } from "next/server"
import { generateCodeVerifier, generateCodeChallenge, generateState } from "@/lib/auth/pkce"
import { authConfig } from "@/lib/auth/config"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = generateCodeChallenge(codeVerifier)
    const state = generateState()

    // Store code verifier and state in temporary cookies for callback verification
    const cookieStore = await cookies()
    cookieStore.set("oauth_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    // Build authorization URL
    const authUrl = new URL(authConfig.authorizationEndpoint)
    authUrl.searchParams.set("client_id", authConfig.clientId)
    authUrl.searchParams.set("redirect_uri", authConfig.redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", authConfig.scope)
    authUrl.searchParams.set("state", state)
    authUrl.searchParams.set("code_challenge", codeChallenge)
    authUrl.searchParams.set("code_challenge_method", authConfig.codeChallengeMethod)

    // Redirect to Laravel authorization endpoint
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("[OAuth2 Login Error]", error)
    return NextResponse.json({ error: "Failed to initiate login" }, { status: 500 })
  }
}
