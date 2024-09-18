import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { connectToDatabase } from '../../lib/mongodb'
import User from '../../models/User'
import { hash, compare } from 'bcrypt'

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
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, bio, socialLinks, currentPassword, newPassword, confirmNewPassword } = req.body
      const user = await User.findOne({ email: session.user?.email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update basic info
      user.name = name
      user.bio = bio
      user.socialLinks = socialLinks

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
        session.user.name = name
      }

      res.status(200).json({ message: 'Profile updated successfully', user: { name: user.name, email: user.email, bio: user.bio, socialLinks: user.socialLinks } })
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}