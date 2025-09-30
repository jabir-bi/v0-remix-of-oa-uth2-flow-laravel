// OAuth2 Configuration for Laravel Passport
export const authConfig = {
  // Laravel backend URLs (development)
  authorizationEndpoint: process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL || "https://laravel.test/oauth/authorize",
  tokenEndpoint: process.env.NEXT_PUBLIC_OAUTH_TOKEN_URL || "https://laravel.test/oauth/token",
  userInfoEndpoint: process.env.NEXT_PUBLIC_OAUTH_USER_INFO_URL || "https://laravel.test/api/user",
  logoutEndpoint: process.env.NEXT_PUBLIC_OAUTH_LOGOUT_URL || "https://laravel.test/api/auth/logout",

  // OAuth2 Client Configuration
  clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "your-client-id",
  redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || "https://next.test/auth/callback",

  // PKCE Configuration
  codeChallengeMethod: "S256" as const,

  // Scopes
  scope: "openid profile email",
} as const

export const cookieConfig = {
  authSession: "auth_session",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}
