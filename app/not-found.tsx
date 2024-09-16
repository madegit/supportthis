import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu, Home } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function NotFound() {
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
                  <Home className="mr-2 h-4 w-4" /> Home
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pt-8 px-4 pb-32 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle className="text-4xl font-bold tracking-tight text-center">404</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
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