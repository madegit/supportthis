"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  ExternalLink,
  Grid,
  Heart,
  Lock,
  ShoppingBag,
  Edit,
  Sliders,
  Zap,
  DollarSign,
  Settings,
  ChevronDown,
  Menu,
} from "lucide-react"

interface Profile {
  name: string
  email: string
  avatarImage: string
}

interface UserMenuProps {
  profile: Profile
}

const menuItems = [
  { icon: Home, label: "Home" },
  { icon: ExternalLink, label: "View page" },
  { icon: Grid, label: "Explore creators" },
  { label: "MONETIZE", isHeader: true },
  { icon: Heart, label: "Supporters" },
  { icon: Lock, label: "Memberships" },
  { icon: ShoppingBag, label: "Shop" },
  { icon: Edit, label: "Publish", hasDropdown: true },
  { label: "SETTINGS", isHeader: true },
  { icon: Sliders, label: "Widgets & Graphics" },
  { icon: Zap, label: "Integrations" },
  { icon: DollarSign, label: "Payouts" },
  { icon: Settings, label: "Settings", link: "/setting" },
]

export function UserMenu({ profile }: UserMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Vertical Menu (Desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-filter backdrop-blur-lg p-4">
        <div className="mb-4 mt-5">
          <div className="w-full p-5 h-8 mx-auto flex items-center text-gray-900 dark:text-gray-100">
            SupportThis.org
          </div>
        </div>
        {menuItems.map((item, index) =>
          item.isHeader ? (
            <h3
              key={index}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2 tracking-tight"
            >
              {item.label}
            </h3>
          ) : (
            <Link
              key={index}
              href={item.link || "#"}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 px-4 py-2 rounded-lg mb-1 tracking-tight"
            >
              {item.icon && <item.icon className="mr-2" size={20} />}
              <span className="flex-grow text-left">{item.label}</span>
              {item.hasDropdown && <ChevronDown size={16} />}
            </Link>
          )
        )}
      </div>

      {/* Mobile Menu (Slide from right) */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 p-4 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 flex flex-col`}
      >
        <div className="flex justify-end mb-4">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {menuItems.map((item, index) =>
            item.isHeader ? (
              <h3
                key={index}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2 tracking-tight"
              >
                {item.label}
              </h3>
            ) : (
              <Link
                key={index}
                href={item.link || "#"}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 px-4 py-2 rounded-lg mb-1 w-full tracking-tight"
              >
                {item.icon && <item.icon className="mr-2" size={20} />}
                <span className="flex-grow text-left">{item.label}</span>
                {item.hasDropdown && <ChevronDown size={16} />}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center p-6 mb-4 md:mt-8">
        <Avatar className="w-10 h-10 md:w-16 md:h-16 mr-4 mb-8 md:mb-0">
          <AvatarImage 
            src={profile.avatarImage || '/placeholder.svg?height=128&width=128'} 
            alt={profile.name} 
          />
          <AvatarFallback>{profile.name ? getInitials(profile.name) : 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welcome back, {profile.name || '👋'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 tracking-tight text-base md:text-lg">
            Here's your supports summary
          </p>
        </div>
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full m-2 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </>
  )
}