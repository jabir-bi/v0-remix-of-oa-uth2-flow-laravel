// OAuth2 Callback Handler - Exchanges authorization code for tokens
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { authConfig } from "@/lib/auth/config"
import { setAuthSession } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  console.log("[v0] OAuth callback started")

  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    console.log("[v0] Callback params:", { hasCode: !!code, hasState: !!state, error })

    // Handle authorization errors
    if (error) {
      console.error("[OAuth2 Callback Error]", error)
      return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
    }

    if (!code || !state) {
      console.log("[v0] Missing code or state")
      return NextResponse.redirect(new URL("/login?error=missing_parameters", request.url))
    }

    // Verify state to prevent CSRF attacks
    const cookieStore = await cookies()
    const storedState = cookieStore.get("oauth_state")?.value
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value

    console.log("[v0] PKCE verification:", {
      hasStoredState: !!storedState,
      hasCodeVerifier: !!codeVerifier,
      stateMatches: storedState === state,
    })

    if (!storedState || storedState !== state) {
      console.log("[v0] State mismatch or missing")
      return NextResponse.redirect(new URL("/login?error=invalid_state", request.url))
    }

    if (!codeVerifier) {
      console.log("[v0] Code verifier missing")
      return NextResponse.redirect(new URL("/login?error=missing_verifier", request.url))
    }

    console.log("[v0] Exchanging code for tokens...")

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(authConfig.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: authConfig.clientId,
        redirect_uri: authConfig.redirectUri,
        code,
        code_verifier: codeVerifier,
      }),
    })

    console.log("[v0] Token response status:", tokenResponse.status)

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error("[Token Exchange Error]", errorData)
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url))
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] Tokens received successfully")

    // Calculate token expiration time
    const expiresAt = Date.now() + tokens.expires_in * 1000

    // Store session in httpOnly cookie
    await setAuthSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      tokenType: tokens.token_type || "Bearer",
    })

    console.log("[v0] Session stored, clearing PKCE cookies")

    // Clear temporary PKCE cookies
    cookieStore.delete("oauth_state")
    cookieStore.delete("oauth_code_verifier")

    console.log("[v0] Redirecting to dashboard")

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("[OAuth2 Callback Error]", error)
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url))
  }
}
