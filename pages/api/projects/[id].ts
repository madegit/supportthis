import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { connectToDatabase } from '../../../lib/mongodb'
import Project from '../../../models/Project'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await connectToDatabase()

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const project = await Project.findById(id)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      res.status(200).json(project)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching project' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { images, description, goal, currentProgress, futurePlans } = req.body

      const project = await Project.findById(id)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      if (project.creator.toString() !== session.user?.id) {
        return res.status(403).json({ message: 'Not authorized to update this project' })
      }

      project.images = images
      project.description = description
      project.goal = goal
      project.currentProgress = currentProgress
      project.futurePlans = futurePlans

      await project.save()

      res.status(200).json({ message: 'Project updated successfully', project })
    } catch (error) {
      res.status(500).json({ message: 'Error updating project' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const project = await Project.findById(id)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      if (project.creator.toString() !== session.user?.id) {
        return res.status(403).json({ message: 'Not authorized to delete this project' })
      }

      await Project.findByIdAndDelete(id)

      res.status(200).json({ message: 'Project deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}