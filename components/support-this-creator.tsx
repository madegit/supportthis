"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import {
  Compass,
  Heart,
  Share2,
  Menu,
  Twitter,
  Instagram,
  Globe,
  Info,
  Rocket,
  Calendar,
  Github,
  Shield,
  UserPlus,
  Linkedin,
  Facebook,
  Text,
  Copy,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SupportFooter } from "@/components/frontSupportFooter";
import Contributors from "./Contributors";
import ProjectDetails from "./ProjectDetails";
import Leaderboard from "./Leaderboard";
import CTASection from "./CTASection";
import SiteRating from "./SiteRating";
import ImageSlider from "./ImageSlider";
import ProjectProgress from "./ProjectProgress";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

const ClubComponent = lazy(() => import("@/components/ClubComponent"));
const ShopComponent = lazy(() => import("@/components/ShopComponent"));

interface SupportThisCreatorProps {
  user: {
    name: string;
    username: string;
    bio: string;
    avatarImage: string;
    coverImage: string;
    socialLinks: {
      github: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      website: string;
    };
    featuredProject?: {
      _id: string;
      images: string[];
      description: string;
      goal: number;
      currentProgress: string;
      futurePlans: string;
    };
  };
}

export default function SupportThisCreator({ user }: SupportThisCreatorProps) {
  const [heartCount, setHeartCount] = useState(1);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const incrementalSectionRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [openAccordionItem, setOpenAccordionItem] = useState("item-0");
  const { toast } = useToast();
  const pathname = usePathname();
  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}${pathname}`;
  const shareTitle = `Support ${user.name} on Creator Platform`;
  const shareDescription = `Check out ${user.name}'s latest project and show your support!`;

  const heartProgress = 75; // Percentage of heart goal reached
  const contributors = [
    { name: "Alice", comment: "Great project!", hearts: 2 },
    { name: "Bob", comment: "Keep up the good work!", hearts: 4 },
    { name: "Charlie", comment: "Excited to see what's next!", hearts: 3 },
  ];

  const calculateHeartValue = (count: number) => count * 3;

  const leaderboard = [
    { name: "Sarah", hearts: 50 },
    { name: "Michael", hearts: 45 },
    { name: "Emma", hearts: 40 },
    { name: "David", hearts: 35 },
    { name: "Olivia", hearts: 30 },
  ];

  const projectDetails = user.featuredProject
    ? [
        {
          title: "Description",
          content: user.featuredProject.description,
          icon: <Text className="h-5 w-5" />,
        },
        {
          title: "Current Progress",
          content: user.featuredProject.currentProgress,
          icon: <Rocket className="h-5 w-5" />,
        },
        {
          title: "Future Plans",
          content: user.featuredProject.futurePlans,
          icon: <Calendar className="h-5 w-5" />,
        },
      ]
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsSticky(false);
      },
      { threshold: 0 },
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsSticky(false);
      },
      { threshold: 0 },
    );

    if (incrementalSectionRef.current)
      observer.observe(incrementalSectionRef.current);
    if (headerRef.current) headerObserver.observe(headerRef.current);
    if (footerRef.current) footerObserver.observe(footerRef.current);

    return () => {
      if (incrementalSectionRef.current)
        observer.unobserve(incrementalSectionRef.current);
      if (headerRef.current) headerObserver.unobserve(headerRef.current);
      if (footerRef.current) footerObserver.unobserve(footerRef.current);
    };
  }, []);

  const getSupporterShieldColor = (supporters: number) => {
    if (supporters < 1000) return "text-gray-400";
    if (supporters < 5000) return "text-indigo-400";
    return "text-blue-400";
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The share link has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "There was an error copying the link. Please try again.",
        });
      });
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`;
    window.open(linkedInUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-red-50 dark:bg-black text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header
        ref={headerRef}
        className="bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10"
      >
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <nav className="flex space-x-4">
            {["home", "club", "shop"].map((page) => (
              <Button
                key={page}
                variant="ghost"
                onClick={() => setActivePage(page)}
                className={`capitalize ${
                  activePage === page
                    ? "border-b-2 border-red-200 text-gray-800 dark:text-gray-200"
                    : "text-gray-500 dark:text-gray-400"
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
                <Button
                  variant="outline"
                  className="border-gray-200 w-[90%] justify-center rounded-xl"
                >
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
        {activePage === "home" && (
          <>
            {/* Cover Image */}
            <div className="w-full w-screen relative left-1/2 right-1/2 -mx-[50vw] h-48 lg:h-64 mt-[-32px] mb-[-50px]">
              <Image
                src={user.coverImage || "/cover.jpg?height=256&width=1024"}
                alt="Cover"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            {/* Creator profile */}
            <div className="text-center mb-20">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24 ring-2 ring-red-50 dark:ring-red-50">
                  <AvatarImage
                    src={user.avatarImage || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-3xl font-bold my-2 tracking-tight">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4 tracking-tight text-sm flex items-center justify-center">
                <Shield
                  className={`h-4 w-4 mr-1 ${getSupporterShieldColor(5848)}`}
                />
                5,848 Supporters
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                {user.socialLinks.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                  </a>
                )}
                {user.socialLinks.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  </a>
                )}
                {user.socialLinks.instagram && (
                  <a
                    href={user.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400" />
                  </a>
                )}
                {user.socialLinks.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  </a>
                )}
                {user.socialLinks.website && (
                  <a
                    href={user.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                  <ImageSlider images={user.featuredProject.images} />
                )}

                {/* Project Progress */}
                {user.featuredProject && (
                  <ProjectProgress
                    goal={user.featuredProject.goal}
                    progress={heartProgress}
                  />
                )}

                {/* Send Hearts */}
                <Card
                  ref={incrementalSectionRef}
                  className="mb-8 bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-blur-sm shadow rounded-xl border dark:border-gray-800"
                >
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
                        <TooltipContent
                          side="top"
                          align="end"
                          className="max-w-xs dark:text-gray-800"
                        >
                          <p>
                            Send support to help this project reach its goal.
                            Each heart represents a small donation that goes
                            directly to the creator.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-red-50 dark:bg-[#1a1a1a] rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 dark:text-gray-200 flex items-center">
                          <Heart className="h-5 w-5 mr-1" /> x
                        </span>
                        {[1, 2, 3].map((amount) => (
                          <Button
                            key={amount}
                            variant={
                              heartCount === amount ? "default" : "outline"
                            }
                            onClick={() => setHeartCount(amount)}
                            className={`h-12 w-12 rounded-full ${
                              heartCount === amount
                                ? "bg-red-500 text-white"
                                : "bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-200"
                            } hover:bg-red-600 hover:text-white`}
                          >
                            {amount}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setHeartCount(heartCount + 1)}
                          className="h-12 w-12 rounded-full bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-200 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white"
                        >
                          +1
                        </Button>
                      </div>
                    </div>
                    <Input
                      placeholder="Name or @yoursocial"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mb-4 rounded-xl dark:bg-[#1a1a1a]"
                    />
                    <Textarea
                      placeholder="Say something nice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mb-4 rounded-xl dark:bg-[#1a1a1a] min-h-[100px] resize-none"
                      maxLength={250}
                    />
                    <Button className="w-full bg-red-500 text-white dark:hover:text-white transition-all duration-300 ease-in-out font-semibold tracking-tight hover:bg-red-400 h-12 text-base rounded-xl">
                      Send {heartCount} Hearts{" "}
                      <Heart className="mx-2 h-5 w-5" /> $
                      {calculateHeartValue(heartCount)}
                    </Button>
                  </CardContent>
                </Card>

                {/* Contributors */}
                <Contributors
                  contributors={contributors}
                  calculateHeartValue={calculateHeartValue}
                />
              </div>

              <div>
                {/* Project Details Accordion */}
                {user.featuredProject && (
                  <ProjectDetails
                    projectDetails={projectDetails}
                    openAccordionItem={openAccordionItem}
                    setOpenAccordionItem={setOpenAccordionItem}
                  />
                )}

                {/* Leaderboard */}
                <Leaderboard
                  leaderboard={leaderboard}
                  calculateHeartValue={calculateHeartValue}
                />

                {/* CTA Section */}
                <CTASection />

                {/* Site Rating */}
                <SiteRating />
              </div>
            </div>
          </>
        )}

        {activePage === "club" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                Loading...
              </div>
            }
          >
            <ClubComponent />
          </Suspense>
        )}

        {activePage === "shop" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                Loading...
              </div>
            }
          >
            <ShopComponent />
          </Suspense>
        )}
      </main>

      {/* Sticky send hearts and share buttons */}
      <div
        className={`fixed left-0 right-0 transition-all duration-300 ease-in-out ${isSticky ? "bottom-4" : "-bottom-20"} z-50`}
      >
        <div className="flex space-x-2 px-4 max-w-xl mx-auto">
          <Button className="flex-grow bg-red-500 text-white z-20 hover:bg-red-400 h-12 text-base tracking-tight font-semibold rounded-xl w-[73%]">
            Send {heartCount} Hearts <Heart className="mx-2 h-5 w-5" /> $
            {calculateHeartValue(heartCount)}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white dark:bg-[#121212] hover:bg-red-600 dark:hover:bg-red-400 hover:text-white h-12 px-3 rounded-xl w-[17%]"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[425px] w-5/6 rounded-xl">
              <div className="flex flex-col space-y-4 items-center pb-5">
                <h3 className="text-lg font-semibold">Share</h3>
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant="outline"
                    className="rounded-full p-2"
                    onClick={shareOnTwitter}
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full p-2"
                    onClick={shareOnFacebook}
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full p-2"
                    onClick={shareOnLinkedIn}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
                <div className="w-full flex items-center space-x-2">
                  <Input value={shareLink} readOnly className="flex-grow" />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="p-2"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SupportFooter ref={footerRef} />
    </div>
  );
}
