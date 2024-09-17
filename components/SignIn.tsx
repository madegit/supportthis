'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Github, Mail, AlertCircle, LogIn, UserPlus, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl })
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <Card className="max-w-sm mx-auto bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Sign In</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <Button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
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
            onClick={() => handleOAuthSignIn('google')}
            variant="outline"
            className="rounded-xl"
          >
            <Mail className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button
            onClick={() => handleOAuthSignIn('github')}
            variant="outline"
            className="rounded-xl"
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
        <p className="text-sm text-center">
          New User?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

function SignInWithSearchParams() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') ?? '/dashboard'
  return <SignInForm callbackUrl={callbackUrl} />
}

export default function SignIn() {
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
      <main className="container mx-auto pt-8 px-4 pb-32">
        <Suspense fallback={<div>Loading...</div>}>
          <SignInWithSearchParams />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>Powered by <a href="https://supportthis.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">SupportThis.org</a></p>
        </div>
      </footer>
    </div>
  )
}