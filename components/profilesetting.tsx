import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Target,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

async function getUser(username: string) {
  // Fetch user data from your API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`,
  );
  if (!res.ok) return null;
  return res.json();
}

async function getFeaturedProject(userId: string) {
  // Fetch featured project data from your API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/featured/${userId}`,
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  if (!params || !params.username) {
    notFound();
  }

  const user = await getUser(params.username);
  if (!user) notFound();

  const featuredProject = await getFeaturedProject(user._id);

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
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
              <AvatarImage
                src={user.avatarImage}
                className="w-full h-full object-cover"
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="pt-16">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            {user.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {user.bio}
              </p>
            )}
            <div className="mt-6 flex space-x-4">
              {user.socialLinks.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {user.socialLinks.instagram && (
                <a
                  href={user.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400"
                >
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700"
                >
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {user.socialLinks.website && (
                <a
                  href={user.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500"
                >
                  <Globe className="h-6 w-6" />
                  <span className="sr-only">Website</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {featuredProject && (
          <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Featured Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredProject.images.map((image, index) => (
                    <div key={index} className="relative h-64 w-full">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Project image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <h2 className="text-xl font-semibold">
                  {featuredProject.description}
                </h2>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Funding Goal:</span>
                  <span>${featuredProject.goal.toLocaleString()}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">33%</span>
                  </div>
                  <Progress value={33} className="w-full" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Current Progress</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {featuredProject.currentProgress}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Future Plans</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {featuredProject.futurePlans}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
