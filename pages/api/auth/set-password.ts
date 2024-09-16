import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { hash } from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { password } = req.body
  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  try {
    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const hashedPassword = await hash(password, 10)
    user.password = hashedPassword
    await user.save()

    res.status(200).json({ message: 'Password set successfully' })
  } catch (error) {
    console.error('Error setting password:', error)
    res.status(500).json({ message: 'An error occurred while setting the password' })
  }
}