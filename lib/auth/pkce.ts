// PKCE (Proof Key for Code Exchange) utilities for OAuth2
import { randomBytes, createHash } from "crypto"

/**
 * Generates a cryptographically secure random code verifier
 * @returns Base64 URL-encoded random string (43-128 characters)
 */
export function generateCodeVerifier(): string {
  const buffer = randomBytes(32)
  return base64URLEncode(buffer)
}

/**
 * Generates a code challenge from a code verifier using SHA256
 * @param verifier - The code verifier string
 * @returns Base64 URL-encoded SHA256 hash of the verifier
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = createHash("sha256").update(verifier).digest()
  return base64URLEncode(hash)
}

/**
 * Encodes a buffer to Base64 URL-safe format
 * @param buffer - Buffer to encode
 * @returns Base64 URL-encoded string
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

/**
 * Generates a random state parameter for CSRF protection
 * @returns Random state string
 */
export function generateState(): string {
  return base64URLEncode(randomBytes(32))
}
