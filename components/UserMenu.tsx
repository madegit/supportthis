'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  avatarImage: string;
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    avatarImage: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('An unexpected error occurred', error);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
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
  );
}