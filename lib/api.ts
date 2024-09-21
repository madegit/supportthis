import { connectToDatabase } from './mongodb'
import User from '../models/User'

export async function getUserByUsername(username: string) {
  await connectToDatabase()

  const user = await User.findOne({ username }).select('-password -email')

  if (!user) {
    return null
  }

  return {
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatarImage: user.avatarImage || '',
    coverImage: user.coverImage || '',
    socialLinks: {
      twitter: user.socialLinks?.twitter || '',
      instagram: user.socialLinks?.instagram || '',
      linkedin: user.socialLinks?.linkedin || '',
      website: user.socialLinks?.website || '',
    },
  }
}