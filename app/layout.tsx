import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
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
    <html lang="en">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  )
}