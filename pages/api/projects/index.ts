import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import { connectToDatabase } from '@/lib/mongodb'
import Project from '@/models/Project'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  await connectToDatabase()

  if (req.method === 'POST') {
    try {
      const { images, description, goal, currentProgress, futurePlans } = req.body

      if (!Array.isArray(images) || images.length > 4) {
        return res.status(400).json({ error: 'Invalid number of images' })
      }

      const existingProjects = await Project.find({ creator: session.user.id })
      const isMainProject = existingProjects.length === 0 // Set as main if it's the first project

      const newProject = new Project({
        creator: session.user.id,
        images,
        description,
        goal,
        currentProgress,
        futurePlans,
        isMainProject
      })

      await newProject.save()

      res.status(201).json(newProject)
    } catch (error) {
      console.error('Error creating project:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' })
      }
    }
  } else if (req.method === 'GET') {
    try {
      const projects = await Project.find({ creator: session.user.id }).sort({ isMainProject: -1, createdAt: -1 })
      res.status(200).json(projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      res.status(500).json({ error: 'An unexpected error occurred' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { projectId } = req.body

      // Unset all projects as main
      await Project.updateMany({ creator: session.user.id }, { isMainProject: false })

      // Set the selected project as main
      await Project.findOneAndUpdate(
        { _id: projectId, creator: session.user.id },
        { isMainProject: true },
        { new: true }
      )

      res.status(200).json({ message: 'Main project updated successfully' })
    } catch (error) {
      console.error('Error updating main project:', error)
      res.status(500).json({ error: 'An unexpected error occurred' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}