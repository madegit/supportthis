'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Footer } from '@/components/Footer'
import { PlusCircle, Edit, Trash2, Star, ArrowUpRight } from "lucide-react"
import { ProfileMenu } from "@/components/Menu"

interface Project {
  _id: string
  images: string[]
  description: string
  goal: number
  currentProgress: string
  futurePlans: string
  isMainProject: boolean
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects()
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch projects')
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
          const errorData = await response.json()
          setError(errorData.error || 'Failed to delete project')
        }
      } catch (error) {
        setError('An unexpected error occurred')
      }
    }
  }

  const handleSetMainProject = async (id: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: id }),
      })
      if (response.ok) {
        setProjects(projects.map(project => ({
          ...project,
          isMainProject: project._id === id
        })))
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to set main project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect to signin page
  }

  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex text-base">
      <ProfileMenu />
      <div className="flex-1">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center p-6 mb-4 md:mt-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Your Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 tracking-tight text-base md:text-lg">
              Manage and track your ongoing projects
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 pb-20 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Create New Project Card */}
          <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <PlusCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 tracking-tight text-gray-900 dark:text-gray-100">
                Create New Project
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center tracking-tight">
                Start a new project and share your vision with supporters.
              </p>
              <Link href="/dashboard/projects/create">
                <Button className="bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700">
                  Create Project
                </Button>
              </Link>
            </CardContent>
          </Card>

          {projects.map((project) => (
            <Card key={project._id} className={`bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow ${project.isMainProject ? 'border-2 border-red-500 rounded-xl dark:border-red-400' : ''}`}>
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.images[0] || '/placeholder.svg'}
                    alt="Project"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                  {project.isMainProject && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Main Project
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 tracking-tight text-gray-900 dark:text-gray-100">
                  {project.description.substring(0, 50)}...
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 tracking-tight">
                  Goal: ${project.goal.toLocaleString()}
                </p>
                <Progress value={33} className="mb-4" />
                <div className="flex items-center text-red-500 dark:text-red-400 mb-4">
                  <ArrowUpRight size={20} />
                  <span className="ml-1 font-semibold tracking-tight">
                    33% Completed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={project.isMainProject ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => handleSetMainProject(project._id)}
                    disabled={project.isMainProject}
                    className="flex-1 dark:text-gray-400"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {project.isMainProject ? 'Main Project' : 'Set as Main'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/projects/${project._id}/edit`)} className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project._id)} className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}