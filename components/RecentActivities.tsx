import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentActivities({ activities }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.userImage} alt={activity.userName} />
                  <AvatarFallback>{activity.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.userName}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.amount && <p className="font-semibold">${activity.amount}</p>}
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}