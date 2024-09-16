'use client'

import { useState, useEffect } from 'react'
import { useSession, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CheckPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert({ type: '', message: '' })

    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Password set successfully' })
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        const data = await response.json()
        setAlert({ type: 'error', message: data.message || 'An error occurred while setting the password' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Set Password</CardTitle>
          <CardDescription>Please set a password for your account</CardDescription>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}