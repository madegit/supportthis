import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]"
import { connectToDatabase } from "../../../../../lib/mongodb"
import Project from "../../../../../models/Project"
import { redirect } from "next/navigation"
import Link from 'next/link'

async function getProject(projectId: string) {
  await connectToDatabase()
  return await Project.findById(projectId)
}

export default async function ProjectPage({ params }: { params: { id: string, projectId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/signin")
  }

  const project = await getProject(params.projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <Link href={`/creator/${params.id}/projects`}>Back to Projects</Link>
    </div>
  )
}