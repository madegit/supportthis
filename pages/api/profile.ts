import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { connectToDatabase } from '../../lib/mongodb'
import User from '../../models/User'
import { hash, compare } from 'bcrypt'
import { isUsernameTaken, isUsernameValid } from '../../utils/usernameUtils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: session.user?.email }).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        socialLinks: {
          twitter: user.socialLinks?.twitter || '',
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          website: user.socialLinks?.website || '',
        },
        avatarImage: user.avatarImage || '',
        coverImage: user.coverImage || '',
      })
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, username, bio, socialLinks, currentPassword, newPassword, confirmNewPassword, avatarImage, coverImage } = req.body
      const user = await User.findOne({ email: session.user?.email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Check username validity and availability
      if (username && username !== user.username) {
        if (!isUsernameValid(username)) {
          return res.status(400).json({ message: 'Invalid username format' })
        }
        if (await isUsernameTaken(username)) {
          return res.status(400).json({ message: 'Username is already taken' })
        }
        user.username = username
      }

      // Update basic info
      user.name = name || user.name
      user.bio = bio || null // Allow empty bio

      // Update social links
      user.socialLinks = {
        twitter: socialLinks?.twitter || null,
        instagram: socialLinks?.instagram || null,
        linkedin: socialLinks?.linkedin || null,
        website: socialLinks?.website || null,
      }

      // Update avatar and cover images
      if (avatarImage !== undefined) {
        user.avatarImage = avatarImage || null
      }
      if (coverImage !== undefined) {
        user.coverImage = coverImage || null
      }

      // Handle password update
      if (currentPassword && newPassword && confirmNewPassword) {
        // Verify current password
        const isPasswordValid = await compare(currentPassword, user.password)
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' })
        }

        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
          return res.status(400).json({ message: 'New passwords do not match' })
        }

        // Hash and set new password
        user.password = await hash(newPassword, 10)
      }

      await user.save()

      // Update session
      if (session.user) {
        session.user.name = user.name
        session.user.username = user.username
        session.user.avatarImage = user.avatarImage
        session.user.coverImage = user.coverImage
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          name: user.name || '',
          email: user.email || '',
          username: user.username || '',
          bio: user.bio || '',
          socialLinks: {
            twitter: user.socialLinks?.twitter || '',
            instagram: user.socialLinks?.instagram || '',
            linkedin: user.socialLinks?.linkedin || '',
            website: user.socialLinks?.website || '',
          },
          avatarImage: user.avatarImage || '',
          coverImage: user.coverImage || '',
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}