import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"
import { connectToDatabase } from "../../../../lib/mongodb"
import Creator from "../../../../models/Creator"
import Project from "../../../../models/Project"
import { redirect } from "next/navigation"
import Link from 'next/link'

async function getCreatorProjects(creatorId: string) {
  await connectToDatabase()
  const creator = await Creator.findOne({ creatorId })
  const projects = await Project.find({ creatorId })

  return { creator, projects }
}

export default async function CreatorProjectsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/signin")
  }

  const { creator, projects } = await getCreatorProjects(params.id)

  if (!creator) {
    return <div>Creator not found</div>
  }

  return (
    <div>
      <h1>{creator.name}'s Projects</h1>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link href={`/creator/${params.id}/projects/${project._id}`}>
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found for this creator.</p>
      )}
      <Link href={`/creator/${params.id}`}>Back to Creator Page</Link>
    </div>
  )
}