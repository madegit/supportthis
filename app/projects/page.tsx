'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Footer } from '@/components/Footer'
import { PlusCircle, Edit, Trash2 } from "lucide-react"

interface Project {
  _id: string
  images: string[]
  description: string
  goal: number
  currentProgress: string
  futurePlans: string
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        setError('Failed to fetch projects')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setProjects(projects.filter(project => project._id !== id))
        } else {
          setError('Failed to delete project')
        }
      } catch (error) {
        setError('An unexpected error occurred')
      }
    }
  }

 
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Projects</h1>
          <Link href="/projects/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </Link>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg">
              <CardHeader>
                <CardTitle>{project.description.substring(0, 50)}...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img src={project.images[0] || '/placeholder.svg'} alt="Project" className="object-cover rounded-lg" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Goal: ${project.goal}</p>
                <Progress value={33} className="mb-4" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project._id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project._id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}