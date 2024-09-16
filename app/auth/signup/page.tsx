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
import { Github, Mail, AlertCircle, CheckCircle2, LogIn, UserPlus, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
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
        setAlert({ type: 'success', message: 'Account created successfully! Signing you in...' })
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
        if (result?.error) {
          setAlert({ type: 'error', message: result.error })
        } else {
          router.push('/dashboard')
        }
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

  const handleOAuthSignUp = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold tracking-tight">SupportThis</Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-1">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
              <nav className="flex flex-col space-y-4 items-end mt-8">
                <Button variant="outline" className="border-gray-200 w-[90%] justify-center rounded-xl">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
                <Button className="bg-black text-white hover:bg-red-600 w-[90%] justify-center rounded-xl">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pt-12 px-4 pb-32">
        <Card className="max-w-sm mx-auto bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Sign Up</CardTitle>
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
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">                          Password</Label>
                <Input
                  id="password"
                  type="password"
                   placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-10 text-base rounded-xl" disabled={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <hr className="absolute top-1/2 w-full border-t border-gray-300" />
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={() => handleOAuthSignUp('google')}
                variant="outline"
                className="rounded-xl"
              >
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button
                onClick={() => handleOAuthSignUp('github')}
                variant="outline"
                className="rounded-xl"
              >
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
            <p className="text-sm text-center">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>Copyright 2024 <a href="https://supportthis.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">SupportThis.org</a></p>
        </div>
      </footer>
    </div>
  )
}