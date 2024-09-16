'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { Github, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [needsAccountLinking, setNeedsAccountLinking] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert({ type: '', message: '' })

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Account created successfully! Redirecting...' })
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        const data = await response.json()
        setAlert({ type: 'error', message: data.message || 'An error occurred during sign up' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: string) => {
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.error === 'AccountExists') {
        setNeedsAccountLinking(true)
        setAlert({ 
          type: 'error', 
          message: `An account with this email already exists. Please sign in to link your ${provider} account.` 
        })
      } else if (result?.error) {
        setAlert({ type: 'error', message: `An error occurred during ${provider} sign-up` })
      } else {
        router.push(result?.url || '/dashboard')
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {alert.type && (
            <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-4">
              {alert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up with Email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {needsAccountLinking ? (
            <p className="text-sm text-center">
              Please <Link href="/auth/signin" className="text-blue-600 hover:underline">sign in</Link> to link your account.
            </p>
          ) : (
            <>
              <Button
                onClick={() => handleOAuthSignUp('google')}
                className="w-full"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" /> Sign up with Google
              </Button>
              <Button
                onClick={() => handleOAuthSignUp('github')}
                className="w-full"
                variant="outline"
              >
                <Github className="mr-2 h-4 w-4" /> Sign up with GitHub
              </Button>
            </>
          )}
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}