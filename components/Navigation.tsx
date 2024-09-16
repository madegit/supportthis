import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/">Home</Link></li>
        {session ? (
          <>
            <li><Link href="/projects">My Projects</Link></li>
            <li><Link href="/projects/create">Create Project</Link></li>
            <li><Link href="/api/auth/signout">Sign Out</Link></li>
          </>
        ) : (
          <li><Link href="/api/auth/signin">Sign In</Link></li>
        )}
      </ul>
    </nav>
  )
}