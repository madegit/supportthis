'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

interface ProjectProgressProps {
  goal: number
  progress: number
}

export default function ProjectProgress({ goal, progress }: ProjectProgressProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold tracking-tight flex items-center text-xl">
            Project Goal <Target className="ml-2 h-5 w-5 text-red-500" />
          </span>
          <span className="tracking-tight text-lg">{progress}%</span>
        </div>
        <div className="h-3 bg-red-100 dark:bg-red-900 rounded-full mb-1 overflow-hidden">
          <motion.div 
            className="h-full bg-red-500 flex items-center rounded-full justify-end pr-2"
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${progress}%` : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Goal: ${goal.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}