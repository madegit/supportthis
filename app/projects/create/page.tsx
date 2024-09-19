'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2 } from "lucide-react"
import { Footer } from '@/components/Footer'

export default function CreateProject() {
  const [images, setImages] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [currentProgress, setCurrentProgress] = useState('')
  const [futurePlans, setFuturePlans] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
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
        setError(data.message || 'Failed to create project')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="images">Project Images (Max 4)</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Project image ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
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
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  )
}