import { connectToDatabase } from './mongodb'
import User from '../models/User'
import Project from '../models/Project'

export async function getUserByUsername(username: string) {
  await connectToDatabase()

  const user = await User.findOne({ username }).select('-password -email')

  if (!user) {
    return null
  }

  const featuredProject = await Project.findOne({ creator: user._id, isMainProject: true })

  return {
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatarImage: user.avatarImage || '',
    coverImage: user.coverImage || '',
    socialLinks: {
      github: user.socialLinks?.github || '',
      twitter: user.socialLinks?.twitter || '',
      instagram: user.socialLinks?.instagram || '',
      linkedin: user.socialLinks?.linkedin || '',
      website: user.socialLinks?.website || '',
    },
    featuredProject: featuredProject ? {
      _id: featuredProject._id,
      images: featuredProject.images,
      description: featuredProject.description,
      goal: featuredProject.goal,
      currentProgress: featuredProject.currentProgress,
      futurePlans: featuredProject.futurePlans,
    } : undefined,
  }
}