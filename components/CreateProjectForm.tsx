'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateProjectForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        router.push('/projects')
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}