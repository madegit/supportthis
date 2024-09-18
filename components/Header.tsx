'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogIn, UserPlus, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">SupportThis</Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-2">
              <Menu className="h-5 w-5" />
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
  )
}