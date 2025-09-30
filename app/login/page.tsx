"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard"
    }
  }, [isAuthenticated])

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "missing_parameters":
        return "Missing required parameters. Please try again."
      case "invalid_state":
        return "Invalid state parameter. Possible CSRF attack detected."
      case "missing_verifier":
        return "Missing code verifier. Please try again."
      case "token_exchange_failed":
        return "Failed to exchange authorization code for tokens."
      case "callback_failed":
        return "Authentication callback failed. Please try again."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account using OAuth2 authentication</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}
          <Button onClick={login} className="w-full" size="lg">
            Sign in with OAuth2
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to the Laravel authentication server
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
