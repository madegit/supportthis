import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircleHeart } from "lucide-react"

interface Contributor {
  name: string
  comment: string
  hearts: number
}

interface ContributorsProps {
  contributors: Contributor[]
  calculateHeartValue: (count: number) => number
}

export default function Contributors({ contributors, calculateHeartValue }: ContributorsProps) {
  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border shadow rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="tracking-tight flex items-center text-2xl">
          <MessageCircleHeart className="mr-2 h-6 w-6 text-red-500" />
          Recent Supporters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contributors.map((contributor, index) => (
          <div key={index} className="flex items-center space-x-4 ">
            <Avatar className="h-10 w-10 rounded-full dark:bg-gray-400">
              <AvatarFallback>{contributor.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold tracking-tight">{contributor.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 tracking-tight">{contributor.comment}</p>
            </div>
            <div className="flex items-center text-black dark:text-white">
              <span className="tracking-tight font-semibold">{contributor.hearts} <Heart className="h-4 w-4 inline fill-current" /> ${calculateHeartValue(contributor.hearts)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}