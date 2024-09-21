import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Twitter, Instagram, Linkedin, Globe } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

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
    featuredProject?: {
      _id: string
      images: string[]
      description: string
      goal: number
      currentProgress: string
      futurePlans: string
    }
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="relative h-48 w-full">
          {user.coverImage ? (
            <Image
              src={user.coverImage}
              alt={`${user.name}'s cover`}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
        <CardHeader className="relative">
          <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-white dark:border-gray-800">
            <AvatarImage src={user.avatarImage} className="w-full h-full object-cover" alt={user.name} />
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

          {user.featuredProject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Featured Project</h2>
              <Card className="bg-gray-50 dark:bg-gray-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{user.featuredProject.description}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Goal: ${user.featuredProject.goal.toLocaleString()}
                      </p>
                      <Progress value={33} className="w-full" />
                      <p className="text-sm font-semibold">Current Progress: {user.featuredProject.currentProgress}</p>
                      <p className="text-sm">Future Plans: {user.featuredProject.futurePlans}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {user.featuredProject.images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={image}
                            alt={`Project image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}