'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2, X } from "lucide-react"
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
  const [images, setImages] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [currentProgress, setCurrentProgress] = useState('')
  const [futurePlans, setFuturePlans] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchProject()
    }
  }, [session])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setImages(data.images)
        setDescription(data.description)
        setGoal(data.goal.toString())
        setCurrentProgress(data.currentProgress)
        setFuturePlans(data.futurePlans)
      } else {
        setError('Failed to fetch project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && images.length < 4) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (response.ok) {
          const data = await response.json()
          setImages([...images, data.url])
        } else {
          setError('Failed to upload image')
        }
      } catch (error) {
        setError('An error occurred while uploading the image')
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images,
          description,
          goal: parseFloat(goal),
          currentProgress,
          futurePlans,
        }),
      })

      if (response.ok) {
        router.push('/projects')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to update project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Edit Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="images">Project Images (Max 4)</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Project image ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                  <PlusCircle className="text-gray-400" />
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="goal">Funding Goal ($)</Label>
            <Input
              type="number"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="currentProgress">Current Progress</Label>
            <Textarea
              id="currentProgress"
              value={currentProgress}
              onChange={(e) => setCurrentProgress(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="futurePlans">Future Plans</Label>
            <Textarea
              id="futurePlans"
              value={futurePlans}
              onChange={(e) => setFuturePlans(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Project...
              </>
            ) : (
              'Update Project'
            )}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  )
}