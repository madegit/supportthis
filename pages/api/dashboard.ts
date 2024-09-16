import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { connectToDatabase } from "../../lib/mongodb"
import User from "../../models/User"
import Project from "../../models/Project"
import Supporter from "../../models/Supporter"
import Order from "../../models/Order"
import Membership from "../../models/Membership"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })

    const totalSupporters = await Supporter.countDocuments({ creatorId: user._id })
    const monthlyEarnings = await Order.aggregate([
      { $match: { creatorId: user._id, createdAt: { $gte: new Date(new Date().setDate(1)) } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const totalOrders = await Order.countDocuments({ creatorId: user._id })
    const activeMembers = await Membership.countDocuments({ creatorId: user._id, status: 'active' })

    const projects = await Project.find({ creatorId: user._id }).limit(5)
    const recentActivities = await Promise.all([
      Order.find({ creatorId: user._id }).sort({ createdAt: -1 }).limit(3),
      Supporter.find({ creatorId: user._id }).sort({ createdAt: -1 }).limit(3),
      Membership.find({ creatorId: user._id }).sort({ createdAt: -1 }).limit(3)
    ]).then(([orders, supporters, memberships]) => {
      return [...orders, ...supporters, ...memberships]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
        .map(activity => {
          if (activity.constructor.modelName === 'Order') {
            return {
              action: 'New order',
              userName: activity.customerName,
              userImage: activity.customerImage,
              amount: activity.amount,
              time: activity.createdAt
            }
          } else if (activity.constructor.modelName === 'Supporter') {
            return {
              action: 'New supporter',
              userName: activity.name,
              userImage: activity.image,
              time: activity.createdAt
            }
          } else {
            return {
              action: 'New membership',
              userName: activity.memberName,
              userImage: activity.memberImage,
              amount: activity.planAmount,
              time: activity.createdAt
            }
          }
        })
    })

    res.status(200).json({
      totalSupporters,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      totalOrders,
      activeMembers,
      projects: projects.map(project => ({
        name: project.name,
        progress: project.progress
      })),
      recentActivities
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({ message: 'Error fetching dashboard data' })
  }
}