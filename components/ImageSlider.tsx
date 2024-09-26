'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSliderProps {
  images: string[]
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth)
    }
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length
      controls.start({ x: -newIndex * 100 + '%' })
      return newIndex
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length
      controls.start({ x: -newIndex * 100 + '%' })
      return newIndex
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage()
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mb-8 rounded-xl overflow-hidden w-full lg:pt-[56.25%] pt-[70.25%]">
      <motion.div 
        ref={sliderRef}
        className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ right: 0, left: -sliderWidth }}
        animate={controls}
        transition={{ type: 'spring', damping: 30, stiffness: 500 }}
      >
        <motion.div className="flex w-full h-full">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="min-w-full h-full"
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      <Button 
        variant="ghost" 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 hover:bg-gray-200/20 p-2 z-5"
        onClick={prevImage}
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>
      <Button 
        variant="ghost" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 p-2 z-5 hover:bg-gray-200/20"
        onClick={nextImage}
      >
        <ChevronRight className="h-7 w-7" />
      </Button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-1 rounded-full opacity-50 shadow-sm ${
              index === currentImageIndex ? ' w-5 bg-white' : 'bg-gray-400 ease-in-out opacity-90 duration-300 shadow-sm'
            }`}
          />
        ))}
      </div>
    </div>
  )
}