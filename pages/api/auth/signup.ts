import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { generateUsername } from '../../../utils/usernameUtils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    await connectToDatabase()
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await hash(password, 10)

    // Generate a default username
    const [firstName, ...lastNameParts] = name.split(' ')
    const lastName = lastNameParts.join(' ')
    const username = await generateUsername(firstName, lastName)

    const newUser = new User({ name, email, password: hashedPassword, username })
    await newUser.save()

    res.status(201).json({ message: 'User created successfully', username })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Error creating user' })
  }
}