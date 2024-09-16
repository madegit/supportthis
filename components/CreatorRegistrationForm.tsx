'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCreator } from '../contexts/CreatorContext'
import { useRouter } from 'next/navigation'

export default function CreatorRegistrationForm() {
  const [name, setName] = useState('')
  const { data: session } = useSession()
  const { setCreator } = useCreator()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/creators/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email: session.user.email }),
      })

      if (response.ok) {
        const creatorData = await response.json()
        setCreator(creatorData)
        router.push(`/creator/${creatorData.id}`)
      } else {
        throw new Error('Failed to register as creator')
      }
    } catch (error) {
      console.error('Error registering as creator:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Creator Name"
        required
      />
      <button type="submit">Register as Creator</button>
    </form>
  )
}