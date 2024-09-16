'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams ? searchParams.get('error') : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {error === 'OAuthAccountNotLinked'
              ? 'To confirm your identity, sign in with the same account you used originally.'
              : 'An unexpected error occurred. Please try again.'}
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}