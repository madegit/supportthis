import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Support This Creator',
  description: 'A platform for supporting your favorite creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head />
          <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider></body>
    </html>
  )
}