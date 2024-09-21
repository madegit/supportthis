import { notFound } from 'next/navigation'
import { getUserByUsername } from '@/lib/api'
import UserProfile from '@/components/UserProfile'

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  return <UserProfile user={user} />
}