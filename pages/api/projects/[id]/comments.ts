import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/mongodb'
import Project from '../../../../models/Project'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  const { id } = req.query

  if (req.method === 'POST') {
    try {
      const { name, comment } = req.body

      const project = await Project.findById(id)

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      project.comments.push({ name, comment })
      await project.save()

      res.status(201).json({ message: 'Comment added successfully', comment: project.comments[project.comments.length - 1] })
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}