import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import Project from '../../../models/Project'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await connectToDatabase()

  if (req.method === 'POST') {
    try {
      const { images, description, goal, currentProgress, futurePlans } = req.body

      const user = await User.findOne({ email: session.user?.email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const newProject = new Project({
        creator: user._id,
        images,
        description,
        goal,
        currentProgress,
        futurePlans
      })

      await newProject.save()

      res.status(201).json({ message: 'Project created successfully', project: newProject })
    } catch (error) {
      res.status(500).json({ message: 'Error creating project' })
    }
  } else if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: session.user?.email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const projects = await Project.find({ creator: user._id })

      res.status(200).json(projects)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}