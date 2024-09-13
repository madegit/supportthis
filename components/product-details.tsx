'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart, Truck, RotateCw, CreditCard } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'

export function ComponentsProductDetails() {
  const [quantity, setQuantity] = useState(1)
  const [selectedLicense, setSelectedLicense] = useState('regular')
  const [isSticky, setIsSticky] = useState(false)
  const addToCartRef = useRef(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const productImages = [
    "/t-shirt.jpg?height=400&width=400",
    "/t-shirt2.jpg?height=400&width=400",
    "/t-shirt3.jpg?height=400&width=400"
  ]

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth)
    }
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % productImages.length
      controls.start({ x: -newIndex * 100 + '%' })
      return newIndex
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + productImages.length) % productImages.length
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
  
  const basePrice = 68
  const extendedPrice = 300

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1)
  }

  const calculateTotal = () => {
    const price = selectedLicense === 'regular' ? basePrice : extendedPrice
    return price * quantity
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current)
    }

    return () => {
      if (addToCartRef.current) {
        observer.unobserve(addToCartRef.current)
      }
    }
  }, [])

  
  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src="/avatar.png" alt="Creator" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="font-semibold tracking-tight">John Doe</span>
          </div>
          <Button variant="ghost" className="p-1">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pt-8 px-4 pb-32 lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-6xl">
        {/* Product Image Slider */}
        <div className="relative mb-8 rounded-xl overflow-hidden aspect-square">
          <motion.div 
            ref={sliderRef}
            className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ right: 0, left: -sliderWidth }}
            animate={controls}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <motion.div className="flex w-full h-full">
              {productImages.map((image, index) => (
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
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 hover:bg-gray-200/20 p-2 z-10"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 p-2 z-10 hover:bg-gray-200/20"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-1 rounded-full ${
                        index === currentImageIndex ? ' w-5 bg-white' : 'bg-gray-400 ease-in-out duration-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Limited Edition T-Shirt</h1>

          {/* Product Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-black text-black dark:fill-white dark:text-white" />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">(125 reviews)</span>
          </div>

          {/* Product Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 tracking-tight">
            Show your support with this limited edition t-shirt featuring custom artwork by John Doe. Made from 100% organic cotton for ultimate comfort. Available in multiple sizes and colors.
          </p>

          {/* Pricing Options */}
          <Card className="mb-6 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardContent className="p-4 space-y-4">
              <RadioGroup value={selectedLicense} onValueChange={setSelectedLicense}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="regular" id="regular" className="mt-1 min-w-4" />
                  <Label htmlFor="regular" className="flex-grow">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-2xl font-bold mr-[10px]">${basePrice}</span>
                      <span className="text-sm text-gray-600 mb-[5px] dark:text-gray-400">Regular license — Super file!</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">
                      You can use this resource in Sketch, Adobe XD, Figma formats and edit it according to your needs. Use free for non-commercial projects.
                    </p>
                  </Label>
                </div>
 <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />               
                <div className="flex items-start space-x-2 mt-4">
                  <RadioGroupItem value="extended" id="extended" className="mt-1 min-w-4" />
                  <Label htmlFor="extended" className="flex-grow">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-2xl font-bold mr-[10px]">${extendedPrice}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-[5px]">Extended license — For your next projects!</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">
                      You can use this resource in Sketch, Adobe XD, Figma formats and edit it according to your needs. For creating digital end products for resale such as static designs, static website elements, and inside site constructors.
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Quantity Input and Purchase Button */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <Button variant="ghost" size="sm" onClick={decrementQuantity} className="px-2">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-none"
              />
              <Button variant="ghost" size="sm" onClick={incrementQuantity} className="px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button ref={addToCartRef} className="flex-grow bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl tracking-tight">
              Add to Cart <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-xl font-bold mb-6">
            Total: ${calculateTotal()}
          </div>

          {/* Additional Product Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="flex items-center">
              <RotateCw className="h-5 w-5 mr-2" />
              <p>30-day return policy</p>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              <p>Secure payment process</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating sticky button */}
      <div className={`fixed left-0 right-0 transition-all duration-300 ease-in-out ${isSticky ? 'bottom-4' : '-bottom-20'}`}>
        <div className="container mx-auto max-w-lg px-4">
          <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl flex items-center justify-between">
            <span>${calculateTotal()}</span>
            <span className="flex items-center">
              Add to Cart <ShoppingCart className="ml-2 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p >Powered by <a href="https://supportthis.org/" target="_blank" rel="noopener noreferrer">SupportThis.org</a></p>

        </div>
      </footer>
    </div>
  )
}

export default ComponentsProductDetails