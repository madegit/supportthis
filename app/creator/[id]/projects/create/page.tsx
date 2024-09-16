import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import CreateProjectForm from '../../../../../components/CreateProjectForm'

export default async function CreateProjectPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
      <CreateProjectForm />
    </div>
  )
}