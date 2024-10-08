'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEdgeStore } from '@/lib/edgestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Loader2, Rocket, Calendar, X, ArrowLeft, Text, DollarSign, Target, Save } from "lucide-react"
import { Footer } from '@/components/Footer'

interface Project {
  _id: string
  images: string[]
  description: string
  goal: number
  currentProgress: string
  futurePlans: string
}

export default function EditProject({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { edgestore } = useEdgeStore()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProject()
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        setError('Failed to fetch project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && project && project.images.length < 4) {
      try {
        setIsLoading(true)
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setUploadProgress(progress)
          },
        })
        setProject({
          ...project,
          images: [...project.images, res.url]
        })
        setError('')
      } catch (error) {
        setError('An error occurred while uploading the image')
      } finally {
        setIsLoading(false)
        setUploadProgress(0)
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    if (project) {
      setProject({
        ...project,
        images: project.images.filter((_, i) => i !== index)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })

      if (response.ok) {
        router.push('/dashboard/projects')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl tracking-tight font-bold text-gray-900 dark:text-gray-100">Edit Project</h1>
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/projects')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden md:inline-block">
                Back to Projects
              </span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <PlusCircle className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                  Project Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Project image ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {project.images.length < 4 && (
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <PlusCircle className="text-gray-400 dark:text-gray-500 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Add Image</span>
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  )}
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="bg-red-100 dark:bg-red-900 h-2 rounded-full">
                      <div
                        className="bg-red-500 dark:bg-red-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Uploading: {uploadProgress}%</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Text className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="description"
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    required
                    placeholder="Describe your project..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Target className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                    Funding Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    id="goal"
                    value={project.goal}
                    onChange={(e) => setProject({ ...project, goal: parseFloat(e.target.value) })}
                    required
                    placeholder="Enter funding goal..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-2xl text-gray-900 dark:text-gray-100"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Rocket className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                    Current Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="currentProgress"
                    value={project.currentProgress}
                    onChange={(e) => setProject({ ...project, currentProgress: e.target.value })}
                    placeholder="Describe your current progress..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg shadow md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                    Future Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="futurePlans"
                    value={project.futurePlans}
                    onChange={(e) => setProject({ ...project, futurePlans: e.target.value })}
                    placeholder="Describe your future plans..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </CardContent>
              </Card>
            </div>

            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 py-5 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Project...
                </>
              ) : (
                <>
                  Update Project
                  <Save className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}