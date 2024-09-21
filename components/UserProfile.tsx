import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Twitter, Instagram, Linkedin, Globe } from 'lucide-react'

interface UserProfileProps {
  user: {
    name: string
    username: string
    bio: string
    avatarImage: string
    coverImage: string
    socialLinks: {
      twitter: string
      instagram: string
      linkedin: string
      website: string
    }
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4">
      <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="relative h-48 w-full">
          {user.coverImage ? (
            <Image
              src={user.coverImage}
              alt={`${user.name}'s cover`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
        <CardHeader className="relative">
          <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-white dark:border-gray-800">
            <AvatarImage src={user.avatarImage} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="pt-16">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          {user.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}
          <div className="mt-6 flex space-x-4">
            {user.socialLinks.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
            )}
            {user.socialLinks.instagram && (
              <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
            )}
            {user.socialLinks.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {user.socialLinks.website && (
              <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500">
                <Globe className="h-6 w-6" />
                <span className="sr-only">Website</span>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}