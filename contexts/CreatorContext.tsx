'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Creator = {
  id: string
  name: string
  email: string
}

type CreatorContextType = {
  creator: Creator | null
  setCreator: React.Dispatch<React.SetStateAction<Creator | null>>
  loading: boolean
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined)

export const CreatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchCreator = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/creators?email=${session.user.email}`)
          if (response.ok) {
            const creatorData = await response.json()
            setCreator(creatorData)
          }
        } catch (error) {
          console.error('Error fetching creator:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [session])

  return (
    <CreatorContext.Provider value={{ creator, setCreator, loading }}>
      {children}
    </CreatorContext.Provider>
  )
}

export const useCreator = () => {
  const context = useContext(CreatorContext)
  if (context === undefined) {
    throw new Error('useCreator must be used within a CreatorProvider')
  }
  return context
}