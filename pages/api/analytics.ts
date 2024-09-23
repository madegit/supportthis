// pages/api/analytics.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { connectToDatabase } from '../../lib/mongodb'
import Analytics from '../../models/Analytics'

interface GroupedAnalytics {
  [pathname: string]: {
    visits: number;
    lastVisited: Date;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      await connectToDatabase()
      const analytics = await Analytics.find({ username: session.user?.username })

      // Group analytics by pathname
      const groupedAnalytics = analytics.reduce<GroupedAnalytics>((acc, item) => {
        const pathname = item.pathname === '/[username]' ? 'My Page' : `My Pages/${item.pathname.split('/').pop()}`
        if (!acc[pathname]) {
          acc[pathname] = { visits: 0, lastVisited: item.lastVisited }
        }
        acc[pathname].visits += item.visits
        acc[pathname].lastVisited = new Date(item.lastVisited) > new Date(acc[pathname].lastVisited)
          ? item.lastVisited
          : acc[pathname].lastVisited
        return acc
      }, {})

      // Convert grouped analytics to array
      const formattedAnalytics = Object.entries(groupedAnalytics).map(([pathname, data]) => ({
        pathname,
        visits: data.visits,
        lastVisited: data.lastVisited,
      }))

      res.status(200).json(formattedAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      res.status(500).json({ message: 'Error fetching analytics' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}