import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" 
import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Compass, Heart, Share2, Menu, Twitter, Instagram, Globe, Star, Coffee, Info, Target, Rocket, Calendar, Mail, Clock, Shield, LogIn, UserPlus, ChevronLeft, ChevronRight, LinkIcon, Facebook, ShoppingCart, Zap, Crown, Check, MessageCircle, Users, Video, Lightbulb } from 'lucide-react' 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion, useAnimation } from 'framer-motion'

export default function SupportThisCreator() {
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

  const membershipPlans = [
    { 
      name: 'Bronze', 
      price: 5, 
      icon: <Shield className="h-8 w-8 mb-2 text-orange-400" />,
      benefits: [
        { text: 'Early access to content', icon: <Clock className="h-4 w-4 mr-2" /> },
        { text: 'Monthly newsletter', icon: <Mail className="h-4 w-4 mr-2" /> }
      ]
    },
    { 
      name: 'Silver', 
      price: 10, 
      icon: <Zap className="h-8 w-8 mb-2 text-gray-400" />,
      benefits: [
        { text: 'Bronze benefits', icon: <Check className="h-4 w-4 mr-2" /> },
        { text: 'Exclusive Discord access', icon: <MessageCircle className="h-4 w-4 mr-2" /> },
        { text: 'Quarterly Q&A session', icon: <Users className="h-4 w-4 mr-2" /> }
      ]
    },
    { 
      name: 'Gold', 
      price: 20, 
      icon: <Crown className="h-8 w-8 mb-2 text-yellow-500" />,
      benefits: [
        { text: 'Silver benefits', icon: <Check className="h-4 w-4 mr-2" /> },
        { text: 'Personal thank you video', icon: <Video className="h-4 w-4 mr-2" /> },
        { text: 'Input on future projects', icon: <Lightbulb className="h-4 w-4 mr-2" /> }
      ]
    },
  ]

  const projectDetails = [
    { title: 'Project Goals', content: 'Our main goal is to create an innovative platform that revolutionizes online learning.', icon: <Target className="h-5 w-5" /> },
    { title: 'Current Progress', content: 'We\'ve completed the initial prototype and are now working on user testing and feedback implementation.', icon: <Rocket className="h-5 w-5" /> },
    { title: 'Future Plans', content: 'We aim to launch a beta version within the next 3 months, followed by a full release by the end of the year.', icon: <Calendar className="h-5 w-5" /> },
  ]  

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const projectImages = [
    "/bike.jpg?height=360&width=640",
    "/project.jpg?height=360&width=640",
    "/project4.jpg?height=360&width=640"
  ]

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

  const shopItems = [
    { name: 'T-Shirt', price: 25, image: '/t-shirt.jpg?height=360&width=640', rating: 4.3 },
    { name: 'Mug', price: 15, image: '/mug.jpg?height=360&width=640', rating: null },
    { name: 'Sticker Pack', price: 10, image: '/stickerpack.webp?height=360&width=640', rating: 4.7 },
  ]

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
              <Button variant="ghost" className="p-1">
                <Menu className="h-6 w-6" />
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
      <main className="container mx-auto pt-8 px-4 pb-32 lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-6xl">
        {activePage === 'home' && (
          <>
            <div>
              {/* Creator profile */}
              <div className="text-center mb-8">
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-red-200 rounded-full">
                  <AvatarImage src="/avatar.png" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold tracking-[-1.5px]">John Doe</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4 tracking-[-0.5px]">@johndoe</p>
                <div className="flex justify-center space-x-4 mb-4">
                  <Twitter className="h-5 w-5 text-gray-400" />
                  <Instagram className="h-5 w-5 text-gray-400" />
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto tracking-[-0.5px]">
                  Help support the development of this amazing project that aims to revolutionize the way we interact with technology.
                </p>
              </div>

              {/* Project Images Slider */}
              <div className="relative mb-8 rounded-xl overflow-hidden w-full" style={{ paddingTop: '56.25%' }}>
                <motion.div 
                  ref={sliderRef}
                  className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ right: 0, left: -sliderWidth }}
                  animate={controls}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
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
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 hover:bg-gray-200/20 p-2 z-5"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-200 rounded-xl hover:text-gray-400 p-2 z-5 hover:bg-gray-200/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
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

              {/* Hearts Jar */}
              <Card ref={heartJarRef} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold tracking-[-0.5px] flex items-center">
                      Hearts Jar <Coffee className="ml-2 h-5 w-5 text-red-500" />
                    </span>
                    <span className="tracking-[-0.5px]">{heartProgress}%</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900 rounded-xl overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500 flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: isHeartJarVisible ? `${heartProgress}%` : 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Send Hearts */}
              <Card ref={incrementalSectionRef} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="tracking-[-1px] flex items-center">
                    Send Hearts
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0">
                          <Info className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="end" className="max-w-xs">
                        <p>Send support to help this project reach its goal. Each heart represents a small donation that goes directly to the creator.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-900 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 dark:text-red-400 flex items-center"><Heart className="h-5 w-5 mr-1" /> x</span>
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
                        variant="outline"
                        onClick={() => setHeartCount(heartCount + 1)}
                        className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-red-600 hover:text-white"
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                  <Input
                    placeholder="Name or @yoursocial"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4 rounded-xl"
                  />
                  <Textarea
                    placeholder="Say something nice..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mb-4 rounded-xl"
                  />
                  <Button 
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl"
                  >
                    Send {heartCount} Hearts <Heart className="mx-2 h-5 w-5" /> ${calculateHeartValue(heartCount)}
                  </Button>
                </CardContent>
              </Card>

              {/* Contributors */}
              <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardHeader>
                  <CardTitle className="tracking-[-1px]">Recent Supporters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold tracking-[-0.5px]">{contributor.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 tracking-[-0.5px]">{contributor.comment}</p>
                      </div>
                      <div className="flex items-center text-black dark:text-white">
                        <span className="tracking-[-0.5px] font-semibold">{contributor.hearts} <Heart className="h-4 w-4 inline fill-current" /> ${calculateHeartValue(contributor.hearts)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:pt-[300px]">
              {/* Project Details Accordion */}
              <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardHeader>
                  <CardTitle className="tracking-[-1px]">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {projectDetails.map((detail, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-center">
                            {detail.icon}
                            <span className="ml-2 hover:no-underline">{detail.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>{detail.content}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardHeader>
                  <CardTitle className="tracking-[-1px]">Top Supporters</CardTitle>
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
                        <Avatar className="h-8 w-8 rounded-full mr-2">
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
              <Card className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 tracking-[-1px]">Make money doing what you love</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 tracking-[-0.5px]">No fees on donations!</p>
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 text-base py-2 px-6 rounded-xl">
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
                <span className="ml-2 text-gray-600 dark:text-gray-300 tracking-[-0.5px]">4.0 out of 5</span>
              </div>

              {/* Creators love us */}
              <div className="text-center mb-16">
                <p className="text-lg font-semibold tracking-[-0.5px]">Creators love us.</p>
              </div>
            </div>
          </>
        )}

        {activePage === 'club' && (
          <div className="col-span-2">
            <h2 className="text-3xl font-bold mb-4 tracking-[-1.5px]">Join Our Club</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Become a member and get exclusive benefits to support your favorite creator.</p>
            {/* Recurring Membership Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipPlans.map((plan, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-6 text-center">
                    <div className="flex justify-center">{plan.icon}</div>
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <p className="text-3xl font-semibold">${plan.price}<span className="text-base font-normal">/month</span></p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {plan.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          {benefit.icon}
                          {benefit.text}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 rounded-xl">
                      Subscribe to {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
                </div>
            )}

        {activePage === 'shop' && (
          <div className="col-span-2">
            <h2 className="text-3xl font-bold mb-4 tracking-[-1.5px]">Shop</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Support your favorite creator by purchasing exclusive merchandise.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shopItems.map((item, index) => (
                <Link href="/support/product" key={index} className="mb-8 bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm">
                  <div className="mb-4">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={400} 
                      height={440} 
                      className="w-full h-60 object-cover rounded-lg transition-transform group-hover:scale-105"  />
                  </div>
                  <div className="flex justify-between items-start px-3">
                    <div className="w-[60%]">
                      <h3 className="font-semibold text-lg mb-1 tracking-tight">{item.name}</h3>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 fill-black text-black dark:fill-white dark:text-white mr-1" />
                        {item.rating ? (
                          <span>{item.rating.toFixed(1)}</span>
                        ) : (
                          <span>No ratings</span>
                        )}
                      </div>
                    </div>
                    <p className="w-[35%] text-right font-semibold tracking-tight text-lg">${item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
              <Button variant="outline" className="bg-white dark:bg-gray-800 hover:bg-red-600 dark:hover:bg-red-400 hover:text-white h-12 px-3 rounded-xl w-[17%]">
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

      {/* Footer */}
      <footer ref={footerRef} className="bg-black dark:bg-gray-800 text-white dark:text-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p >Powered by <a href="https://supportthis.org/" target="_blank" rel="noopener noreferrer">SupportThis.org</a></p>
        </div>
      </footer>
    </div>
  )
}  


   