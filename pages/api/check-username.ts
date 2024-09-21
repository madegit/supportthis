import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongodb'
import { isUsernameTaken, isUsernameValid } from '../../utils/usernameUtils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username } = req.query

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Invalid username' })
  }

  await connectToDatabase()

  if (!isUsernameValid(username)) {
    return res.status(400).json({ available: false, message: 'Invalid username format' })
  }

  const taken = await isUsernameTaken(username)

  res.status(200).json({ available: !taken })
}