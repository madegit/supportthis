import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { connectToDatabase } from "../../../lib/mongodb"
import Project from "../../../models/Project"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { title, description } = req.body

  if (!title || !description) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    await connectToDatabase()
    const newProject = new Project({
      title,
      description,
      creatorId: session.user.id,
    })
    await newProject.save()
    res.status(201).json({ message: 'Project created successfully', project: newProject })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ message: 'Error creating project' })
  }
}