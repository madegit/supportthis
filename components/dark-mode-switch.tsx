"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-gray-400" />
      <button
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300  ring-2 ${
          theme === 'dark' ? 'ring-red-500' : 'ring-gray-400'
        }`}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
      <Moon className="h-4 w-4 text-gray-400" />
    </div>
  )
}