import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from 'lucide-react'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
     <Header />

      {/* Main content */}
      <main className="container mx-auto pt-8 px-4 pb-32 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle className="text-5xl font-bold tracking-tight text-center">404</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-6 tracking-tight">Oops! The page you're looking for doesn't exist.</p>
            <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl">
              <Link href="/">
                <Home className="mr-2 h-4 w-4 tracking-tight" /> Go to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

     <Footer />
    </div>
  )
}