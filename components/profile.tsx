'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, RefreshCw, Share2, Settings, Twitter, Instagram, Linkedin, Globe } from 'lucide-react'

interface Profile {
  name: string
  email: string
  image: string
  bio: string
  socialLinks: {
    twitter: string
    instagram: string
    linkedin: string
    website: string
  }
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.name || '',
          email: data.email || '',
          image: data.image || '',
          bio: data.bio || '',
          socialLinks: {
            twitter: data.socialLinks?.twitter || '',
            instagram: data.socialLinks?.instagram || '',
            linkedin: data.socialLinks?.linkedin || '',
            website: data.socialLinks?.website || '',
          },
        })
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('An unexpected error occurred', error)
    }
  }

  if (status === 'loading' || !profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full mx-auto overflow-hidden rounded-xl">
          <div className="h-32 bg-gray-200">
            <img src="../../cover.jpg?height=128&width=896" alt="Cover" className="w-full h-full object-cover" />
          </div>
          <CardContent className="relative pt-16 pb-8 px-6">
            <Avatar className="absolute -top-16 left-6 h-32 w-32 border-4 border-red-50 mb-8 rounded-full">
              <AvatarImage src={profile.image || '/placeholder.svg?height=128&width=128'} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl tracking-tight font-bold">{profile.name}</h1>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              <div>
                <Button variant="outline" className="mr-2 rounded-xl" onClick={() => router.push('/dashboard/profile/setting')}>
                  Edit Profile
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
            <p className="text-gray-700 pr-2 mb-6">{profile.bio}</p>
            <div className="flex space-x-4 mb-6">
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-400" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4 text-gray-600 hover:text-pink-500" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-700" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 text-gray-600 hover:text-green-500" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}