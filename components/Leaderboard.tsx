import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Heart } from "lucide-react"

interface Supporter {
  name: string
  hearts: number
}

interface LeaderboardProps {
  leaderboard: Supporter[]
  calculateHeartValue: (count: number) => number
}

export default function Leaderboard({ leaderboard, calculateHeartValue }: LeaderboardProps) {
  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="tracking-tight flex items-center text-2xl">
          <Crown className="mr-2 h-6 w-6 text-red-500" />
          Top Supporters
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.map((supporter, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center">
              <span className={`font-semibold mr-2 ${
                index === 0 ? 'text-3xl' :
                index === 1 ? 'text-2xl' :
                index === 2 ? 'text-xl' : ''
              }`}>{index + 1}.</span>
              <Avatar className="h-8 w-8 rounded-full mr-2 dark:bg-gray-700">
                <AvatarFallback>{supporter.name[0]}</AvatarFallback>
              </Avatar>
              <span className={
                index === 0 ? 'text-xl font-bold tracking-tight' :
                index === 1 ? 'text-lg font-semibold tracking-tight' :
                index === 2 ? 'text-base font-semibold tracking-tight' : ''
              }>{supporter.name}</span>
            </div>
            <div className="flex items-center text-black dark:text-white">
              <span className="font-semibold">{supporter.hearts} <Heart className="h-4 w-4 inline fill-current" /> ${calculateHeartValue(supporter.hearts)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}