import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../pages/api/auth/[...nextauth]"
import { connectToDatabase } from "../../../lib/mongodb"
import Creator from "../../../models/Creator"
import Project from "../../../models/Project"
import Membership from "../../../models/Membership"
import Product from "../../../models/Product"
import { redirect } from "next/navigation"

async function getCreatorData(creatorId: string) {
  await connectToDatabase()
  const creator = await Creator.findOne({ creatorId })
  const projects = await Project.find({ creatorId })
  const memberships = await Membership.find({ creatorId })
  const products = await Product.find({ creatorId })

  return { creator, projects, memberships, products }
}

export default async function CreatorPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/signin")
  }

  const { creator, projects, memberships, products } = await getCreatorData(params.id)

  if (!creator) {
    return <div>Creator not found</div>
  }

  return (
    <div>
      <h1>{creator.name}'s Page</h1>
      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>{project.title}</li>
        ))}
      </ul>
      <h2>Memberships</h2>
      <ul>
        {memberships.map((membership) => (
          <li key={membership._id}>{membership.name} - ${membership.price}</li>
        ))}
      </ul>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  )
}