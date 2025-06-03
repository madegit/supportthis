"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, MenuIcon, LogOut } from "lucide-react";
import {
  ArrowUpRight,
  Grid,
  Anvil,
  Heart,
  Lock,
  ShoppingBag,
  Pencil,
  Sliders,
  LayoutDashboard,
  Zap,
  DollarSign,
  Settings,
} from "lucide-react";

const baseUrl = "/dashboard";

const menuItems = [
  { icon: LayoutDashboard, label: "Home", href: `${baseUrl}` },
  {
    icon: ArrowUpRight,
    label: "View page",
    href: "",
    isExternal: true,
    isDynamic: true,
  },
  { icon: Grid, label: "Explore creators", href: `/explore` },
  { label: "MONETIZE", isHeader: true },
  { icon: Anvil, label: "Projects", href: `${baseUrl}/projects` },
  { icon: Heart, label: "Supporters", href: `${baseUrl}/supporters` },
  { icon: Lock, label: "Memberships", href: `${baseUrl}/memberships` },
  { icon: ShoppingBag, label: "Shop", href: `${baseUrl}/shop` },
  { icon: Pencil, label: "Create", hasDropdown: true, href: `${baseUrl}/` },
  { label: "INTEGRATION", isHeader: true },
  { icon: Sliders, label: "Widgets & Graphics", href: `${baseUrl}/widgets` },
  { icon: Zap, label: "Plugins", href: `${baseUrl}/plugins` },
  { label: "ACCOUNT", isHeader: true },
  { icon: DollarSign, label: "Payouts", href: `${baseUrl}/payouts` },
  { icon: Settings, label: "Settings", href: `${baseUrl}/settings` },
  { icon: LogOut, label: "Sign Out", href: "", isSignOut: true },
];

export function ProfileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session, status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const renderMenuItem = (item: any, index: number) => {
    if (item.isHeader) {
      return (
        <h3
          key={index}
          className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2 tracking-tight"
        >
          {item.label}
        </h3>
      );
    }

    let href = item.href;
    if (item.isDynamic && username) {
      href = `/${username}`;
    }

    if (item.isDynamic && !username) {
      return null; // Don't render the "View page" link if there's no username
    }

    if (item.isSignOut) {
      return (
        <button
          key={index}
          onClick={handleSignOut}
          className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg mb-1 tracking-tight w-full text-left"
        >
          {item.icon && <item.icon className="mr-2" size={20} />}
          <span className="flex-grow">{item.label}</span>
        </button>
      );
    }

    return (
      <Link
        key={index}
        href={href}
        target={item.isExternal ? "_blank" : "_self"}
        className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg mb-1 tracking-tight"
      >
        {item.icon && <item.icon className="mr-2" size={20} />}
        <span className="flex-grow text-left">{item.label}</span>
        {item.hasDropdown && <ChevronDown size={16} />}
      </Link>
    );
  };

  return (
    <>
      {/* Vertical Menu (Desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-[#121212] bg-opacity-80 dark:bg-opacity-80 backdrop-filter backdrop-blur-lg p-4 border-r dark:border-black">
        <div className="mb-4 mt-5">
          <div className="w-full p-5 h-8 mx-auto flex items-center text-gray-900 dark:text-white">
            SupportThis.org
          </div>
        </div>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </div>

      {/* Mobile Menu (Slide from right) */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#121212] p-4 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 flex flex-col border-l dark:border-gray-800`}
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
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#121212] rounded-full m-2 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 border dark:border-gray-800"
        >
          <MenuIcon size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </>
  );
}
