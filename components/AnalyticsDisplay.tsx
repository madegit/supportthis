// components/AnalyticsDisplay.tsx
import React from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AnalyticsItem {
  pathname: string
  visits: number
  lastVisited: string
}

export default function AnalyticsDisplay() {
  const { data: session } = useSession()
  const { data: analytics, error } = useSWR<AnalyticsItem[]>('/api/analytics', fetcher)

  if (error) return <div>Failed to load analytics</div>
  if (!analytics) return <div>Loading...</div>

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Page Analytics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Page</th>
              <th className="px-4 py-2 text-left">Visits</th>
              <th className="px-4 py-2 text-left">Last Visited</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item) => (
              <tr key={item.pathname} className="border-b">
                <td className="px-4 py-2">{item.pathname}</td>
                <td className="px-4 py-2">{item.visits} visits</td>
                <td className="px-4 py-2">{new Date(item.lastVisited).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}