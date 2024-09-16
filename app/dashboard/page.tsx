import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { BarChart, Users, FileText, Settings } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard, {session.user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View your project analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart className="h-12 w-12 mb-4" />
            <Button asChild>
              <Link href="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audience</CardTitle>
            <CardDescription>Manage your audience</CardDescription>
          </CardHeader>
          <CardContent>
            <Users className="h-12 w-12 mb-4" />
            <Button asChild>
              <Link href="/audience">Manage Audience</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Create and manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <FileText className="h-12 w-12 mb-4" />
            <Button asChild>
              <Link href="/content">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Adjust your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Settings className="h-12 w-12 mb-4" />
            <Button asChild>
              <Link href="/settings">Account Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}