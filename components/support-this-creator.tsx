'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" 
import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Compass, Heart, Share2, MessageCircleHeart, Menu, Twitter, Instagram, Globe, Star, Coffee, Info, Target, Rocket, Calendar, Github, Mail, Clock, Shield, UserPlus, ChevronLeft, Anvil, ChevronRight, Linkedin, LinkIcon, Facebook, ShoppingCart, Text, Zap, Crown, Check, MessageCircle, Users, Video, Lightbulb, BarChart2, PieChart, TrendingUp } from 'lucide-react' 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion, useAnimation } from 'framer-motion'
import { SupportFooter } from "@/components/SupportFooter"

const ClubComponent = lazy(() => import('@/components/ClubComponent'))
const ShopComponent = lazy(() => import('@/components/ShopComponent'))

interface SupportThisCreatorProps {
  user: {
    name: string
    username: string
    bio: string
    avatarImage: string
    coverImage: string
    socialLinks: {
      github: string
      twitter: string
      instagram: string
      linkedin: string
      website: string
    }
    featuredProject?: {
      _id: string
      images: string[]
      description: string
      goal: number
      currentProgress: string
      futurePlans: string
    }
  }
}

export default function SupportThisCreator({ user }: SupportThisCreatorProps) {
  const [heartCount, setHeartCount] = useState(1)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const [activePage, setActivePage] = useState('home')
  const [isHeartJarVisible, setIsHeartJarVisible] = useState(false)
  const incrementalSectionRef = useRef(null)
  const headerRef = useRef(null)
  const footerRef = useRef(null)
  const heartJarRef = useRef(null)
  const [openAccordionItem, setOpenAccordionItem] = useState('item-0')

  const heartProgress = 75 // Percentage of heart goal reached
  const contributors = [
    { name: 'Alice', comment: 'Great project!', hearts: 2 },
    { name: 'Bob', comment: 'Keep up the good work!', hearts: 4 },
    { name: 'Charlie', comment: 'Excited to see what\'s next!', hearts: 3 },
  ]

  const calculateHeartValue = (count: number) => count * 3

  const leaderboard = [
    { name: 'Sarah', hearts: 50 },
    { name: 'Michael', hearts: 45 },
    { name: 'Emma', hearts: 40 },
    { name: 'David', hearts: 35 },
    { name: 'Olivia', hearts: 30 },
  ]

  const projectDetails = user.featuredProject ? [
    { title: 'Description', content: user.featuredProject.description, icon: <Text className="h-5 w-5" /> },
    { title: 'Current Progress', content: user.featuredProject.currentProgress, icon: <Rocket className="h-5 w-5" /> },
    { title: 'Future Plans', content: user.featuredProject.futurePlans, icon: <Calendar className="h-5 w-5" /> },
  ] : []

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const projectImages = user.featuredProject?.images || []

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth)
    }
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % projectImages.length
      controls.start({ x: -newIndex * 100 + '%' })
      return newIndex
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + projectImages.length) % projectImages.length
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsSticky(false)
      },
      { threshold: 0 }
    )

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsSticky(false)
      },
      { threshold: 0 }
    )

    const heartJarObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeartJarVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (incrementalSectionRef.current) observer.observe(incrementalSectionRef.current)
    if (headerRef.current) headerObserver.observe(headerRef.current)
    if (footerRef.current) footerObserver.observe(footerRef.current)
    if (heartJarRef.current) heartJarObserver.observe(heartJarRef.current)

    return () => {
      if (incrementalSectionRef.current) observer.unobserve(incrementalSectionRef.current)
      if (headerRef.current) headerObserver.unobserve(headerRef.current)
      if (footerRef.current) footerObserver.unobserve(footerRef.current)
      if (heartJarRef.current) heartJarObserver.unobserve(heartJarRef.current)
    }
  }, [])

  const getSupporterShieldColor = (supporters: number) => {
    if (supporters < 1000) return 'text-gray-400'
    if (supporters < 5000) return 'text-indigo-400'
    return 'text-blue-400'
  }

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header ref={headerRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <nav className="flex space-x-4">
            {['home', 'club', 'shop'].map((page) => (
              <Button
                key={page}
                variant="ghost"
                onClick={() => setActivePage(page)}
                className={`capitalize ${
                  activePage === page 
                    ? 'border-b-2 border-red-200 text-gray-800 dark:text-gray-200' 
                    : 'text-gray-500 dark:text-gray-400'
                } rounded-none`}
              >
                {page}
              </Button>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
              <nav className="flex flex-col space-y-4 items-end mt-8">
                <Button variant="outline" className="border-gray-200 w-[90%] justify-center rounded-xl">
                  <Compass className="mr-2 h-4 w-4" /> Discover
                </Button>
                <Button className="bg-black text-white hover:bg-red-600 w-[90%] justify-center rounded-xl">
                  <UserPlus className="mr-2 h-4 w-4" /> Get Started
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pt-8 px-4 pb-32">
        {activePage === 'home' && (
          <>
            {/* Cover Image */}
            <div className="w-full w-screen relative left-1/2 right-1/2 -mx-[50vw] h-64 mt-[-32px] mb-[-50px] sm:h-48">
              <Image
                src={user.coverImage || '/cover.jpg?height=256&width=1024'}
                alt="Cover"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            {/* Creator profile */}
            <div className="text-center mb-20">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24 ring-2 ring-red-50 dark:ring-red-50">
                  <AvatarImage src={user.avatarImage} alt={user.name} className="w-full h-full object-cover"/>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-3xl font-bold my-2 tracking-tight">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4 tracking-tight text-sm flex items-center justify-center">
                <Shield className={`h-4 w-4 mr-1 ${getSupporterShieldColor(5848)}`} />
                5,848 Supporters
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                {user.socialLinks.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                  </a>
                )}
                
                {user.socialLinks.twitter && (
                  <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  </a>
                )}
                {user.socialLinks.instagram && (
                  <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400" />
                  </a>
                )}
                {user.socialLinks.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  </a>
                )}
                {user.socialLinks.website && (
                  <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </a>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto tracking-tight">
                {user.bio}
              </p>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div>
                {/* Project Images Slider */}
                {user.featuredProject && (
                  <div className="relative mb-8 rounded-xl overflow-hidden w-full" style={{ paddingTop: '56.25%' }}>
                    <motion.div 
                      ref={sliderRef}
                      className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
                      drag="x"
                      dragConstraints={{ right: 0, left: -sliderWidth }}
                      animate={controls}
                      transition={{ type: 'spring', damping: 30, stiffness: 500 }}
                    >
                      <motion.div className="flex w-full h-full">
                        {projectImages.map((image, index) => (
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
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover: text-gray-400 hover:bg-gray-200/20 p-2 z-5"
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
                      {projectImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-1 rounded-full ${
                            index === currentImageIndex ? ' w-5 bg-white' : 'bg-gray-400 ease-in-out duration-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Progress */}
                {user.featuredProject && (
                  <Card ref={heartJarRef} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold tracking-tight flex items-center text-xl">
                          Project Goal <Target className="ml-2 h-5 w-5 text-red-500" />
                        </span>
                        <span className="tracking-tight text-lg">{heartProgress}%</span>
                      </div>
                      <div className="h-3 bg-red-100 dark:bg-red-900 rounded-full mb-1 overflow-hidden">
                        <motion.div 
                          className="h-full bg-red-500 flex items-center rounded-full justify-end pr-2"
                          initial={{ width: 0 }}
                          animate={{ width: isHeartJarVisible ? `${heartProgress}%` : 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Goal: ${user.featuredProject.goal.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Send Hearts */}
                <Card ref={incrementalSectionRef} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="tracking-tight flex items-center text-2xl">
                      <Heart className="mr-2 h-6 w-6 text-red-500" />
                      Send Hearts
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Info className="h-5 w-5 text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="end" className="max-w-xs dark:text-gray-800">
                          <p>Send support to help this project reach its goal. Each heart represents a small donation that goes directly to the creator.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-red-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 dark:text-gray-200 flex items-center"><Heart className="h-5 w-5 mr-1" /> x</span>
                        {[1, 2, 3].map((amount) => (
                          <Button
                            key={amount}
                            variant={heartCount === amount ? "default" : "outline"}
                            onClick={() => setHeartCount(amount)}
                            className={`h-12 w-12 rounded-full ${
                              heartCount === amount ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200'
                            } hover:bg-red-600 hover:text-white`}
                          >
                            {amount}
                          </Button>
                        ))}
                        <Button
                          variant='outline'
                          onClick={() => setHeartCount(heartCount + 1)}
                          className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white" >
                          +1
                        </Button>
                      </div>
                    </div>
                    <Input
                      placeholder="Name or @yoursocial"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mb-4 rounded-xl dark:bg-gray-900"
                    />
                    <Textarea
                      placeholder="Say something nice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mb-4 rounded-xl dark:bg-gray-900 min-h-[100px] resize-none"
                      maxLength={250}
                    />
                    <Button 
                      className="w-full bg-black dark:bg-red-500 text-white dark:text-white dark:hover:text-red-500 hover:bg-red-600 font-semibold dark:hover:bg-gray-700 h-12 text-base rounded-xl"
                    >
                      Send {heartCount} Hearts <Heart className="mx-2 h-5 w-5" /> ${calculateHeartValue(heartCount)}
                    </Button>
                  </CardContent>
                </Card>

                {/* Contributors */}
                <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border shadow rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="tracking-tight flex items-center text-2xl">
                      <MessageCircleHeart className="mr-2 h-6 w-6 text-red-500" />
                      Recent Supporters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contributors.map((contributor, index) => (
                      <div key={index} className="flex items-center space-x-4 ">
                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold tracking-tight">{contributor.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-tight">{contributor.comment}</p>
                        </div>
                        <div className="flex items-center text-black dark:text-white">
                          <span className="tracking-tight font-semibold">{contributor.hearts} <Heart className="h-4 w-4 inline fill-current" /> ${calculateHeartValue(contributor.hearts)}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                {/* Project Details Accordion */}
                {user.featuredProject && (
                  <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border shadow rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="tracking-tight flex items-center text-2xl">
                        <Anvil className="mr-2 h-6 w-6 text-red-500" />
                        The Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion
                        type="single" 
                        collapsible
                        value={openAccordionItem}
                        onValueChange={setOpenAccordionItem}
                      >
                        {projectDetails.map((detail, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className='hover:no-underline'>
                              <div className="flex items-center">
                                {detail.icon}
                                <span className="ml-2">{detail.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{detail.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}

                {/* Leaderboard */}
                <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="tracking-tight flex items-center text-2xl">
                      <Crown className="mr-2 h-6 w-6 text-red-500" />
                      Top Supporters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leaderboard.map((supporter, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center">
                          <span className={`font-semibold mr-2 ${
                            index === 0 ? 'text-3xl' :
                            index === 1 ? 'text-2xl' :
                            index === 2 ? 'text-xl' : ''
                          }`}>{index + 1}.</span>
                          <Avatar className="h-8 w-8 rounded-full mr-2 dark:bg-gray-700">
                            <AvatarFallback>{supporter.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className={
                            index === 0 ? 'text-xl font-bold tracking-tight' :
                            index === 1 ? 'text-lg font-semibold tracking-tight' :
                            index === 2 ? 'text-base font-semibold tracking-tight' : ''
                          }>{supporter.name}</span>
                        </div>
                        <div className="flex items-center text-black dark:text-white">
                          <span className="font-semibold">{supporter.hearts} <Heart className="h-4 w-4 inline fill-current" /> ${calculateHeartValue(supporter.hearts)}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* CTA Section */}
                <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow rounded-xl">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">Make money doing what you love</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 tracking-tight">Join 9k+ creators getting hearts!</p>
                    <Button className="bg-black dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400 text-base py-2 px-6 rounded-xl">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>

                {/* Site Rating */}
                <div className="flex justify-center items-center space-x-1 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  <span className="ml-2 text-gray-600 dark:text-gray-300 tracking-tight">4.0 out of 5</span>
                </div>

                {/* Creators love us */}
                <div className="text-center mb-16">
                  <p className="text-xl font-semibold tracking-tight">Creators love us.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activePage === 'club' && (
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <ClubComponent />
          </Suspense>
        )}

        {activePage === 'shop' && (
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <ShopComponent />
          </Suspense>
        )}
      </main>

      {/* Sticky send hearts and share buttons */}
      <div className={`fixed left-0 right-0 transition-all duration-300 ease-in-out ${isSticky ? 'bottom-4' : '-bottom-20 z-15'}`}>
        <div className="flex space-x-2 px-4 max-w-xl mx-auto">
          <Button className="flex-grow bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl w-[73%]">
            Send {heartCount} Hearts <Heart className="mx-2 h-5 w-5" /> ${calculateHeartValue(heartCount)}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-400 hover:text-white h-12 px-3 rounded-xl w-[17%]">
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[425px] w-5/6 rounded-xl">
              <div className="flex flex-col space-y-4 items-center">
                <h3 className="text-lg font-semibold">Share</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" className="rounded-full p-2">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="rounded-full p-2">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="rounded-full p-2">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="rounded-full p-2">
                    <LinkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SupportFooter />

    </div>
  )
}