"use client";

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import {
  ArrowUpRight,
  Coffee,
  Music,
  Film,
  CreditCard,
  HelpCircle,
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
  ArrowRight,
  BarChart2,
  PieChart,
  TrendingUp,
  Target,
} from "lucide-react";
import { Footer } from '@/components/Footer'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statisticsData = [
  { name: "Mon", lastWeek: 200, thisWeek: 400 },
  { name: "Tue", lastWeek: 300, thisWeek: 300 },
  { name: "Wed", lastWeek: 250, thisWeek: 350 },
  { name: "Thu", lastWeek: 100, thisWeek: 450 },
  { name: "Fri", lastWeek: 350, thisWeek: 250 },
  { name: "Sat", lastWeek: 150, thisWeek: 400 },
  { name: "Sun", lastWeek: 280, thisWeek: 380 },
];

const topSupporters = [
  { name: "Alice Johnson", amount: 500 },
  { name: "Bob Smith", amount: 450 },
  { name: "Charlie Brown", amount: 400 },
  { name: "Diana Ross", amount: 350 },
  { name: "Ethan Hunt", amount: 300 },
];

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
  { icon: Settings, label: "Settings" },
];

    export function DashboardComponent() {
      const { data: session, status } = useSession();
      const router = useRouter();
      const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatarImage: "",
        coverImage: "",
        bio: "",
        socialLinks: {
          twitter: "",
          instagram: "",
          linkedin: "",
          website: "",
        },
      });
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [scrollY, setScrollY] = useState(0);

      useEffect(() => {
        if (status === 'authenticated') {
          fetchProfile();
        }
      }, [status]);

      useEffect(() => {
        const handleScroll = () => {
          setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

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


      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return null;
      }

      const totalThisWeek = statisticsData.reduce(
        (sum, day) => sum + day.thisWeek,
        0
      );
      const totalLastWeek = statisticsData.reduce(
        (sum, day) => sum + day.lastWeek,
        0
      );


  return (
    <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex text-base">
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
            <button
              key={index}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 px-4 py-2 rounded-lg mb-1 tracking-tight"
            >
              {item.icon && <item.icon className="mr-2" size={20} />}
              <span className="flex-grow text-left">{item.label}</span>
              {item.hasDropdown && <ChevronDown size={16} />}
            </button>
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
              <button
                key={index}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 px-4 py-2 rounded-lg mb-1 w-full tracking-tight"
              >
                {item.icon && <item.icon className="mr-2" size={20} />}
                <span className="flex-grow text-left">{item.label}</span>
                {item.hasDropdown && <ChevronDown size={16} />}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
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
       

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Statistics Card */}
          <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
            <div className="flex items-center mb-4">
              <BarChart2 className="mr-2 text-red-500 dark:text-red-400" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Statistics</h2>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-2"></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${totalThisWeek}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-200 dark:bg-red-700 rounded-full mr-2"></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Week</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${totalLastWeek}</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={statisticsData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                />
                <YAxis hide={true} />
                <Tooltip
                  formatter={(value, name) => [
                    `$${value}`,
                    name === "lastWeek" ? "Last" : "This",
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="lastWeek" fill="#FEE2E2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="thisWeek" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Metrics Card */}
          <div className="bg-red-100 dark:bg-red-900 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow relative">
            <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full"></div>
            </div>
            <div className="flex items-center mb-4">
              <TrendingUp className="mr-2 text-red-500 dark:text-red-400" size={24} />
              <h2 className="text-gray-600 dark:text-gray-300 text-xl tracking-tight">
                Financial Metrics
              </h2>
            </div>
            <p className="text-5xl font-bold mb-2 tracking-tight text-gray-900 dark:text-gray-100">$12,650</p>
            <p className="text-lg font-semibold mb-4 tracking-tight text-gray-700 dark:text-gray-300">
              Total Funds Raised
            </p>
            <hr className="my-4 border-red-200 dark:border-red-700" />
            <div className="flex items-center text-red-500 dark:text-red-400 mb-4">
              <ArrowUpRight size={20} />
              <span className="ml-1 font-semibold tracking-tight">
                +18% from last month
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold tracking-tight text-gray-700 dark:text-gray-300">
                    Tier 1 Supporters
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">
                    $5 per month
                  </p>
                </div>
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">$1,200</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold tracking-tight text-gray-700 dark:text-gray-300">
                    Tier 2 Supporters
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">
                    $10 per month
                  </p>
                </div>
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">$3,500</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold tracking-tight text-gray-700 dark:text-gray-300">
                    Tier 3 Supporters
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">
                    $20 per month
                  </p>
                </div>
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">$7,950</p>
              </div>
            </div>
          </div>

          {/* Project Goals Card */}
          <div className="bg-red-500 dark:bg-red-700 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow text-white">
            <div className="flex items-center mb-4">
              <Target className="mr-2 text-white" size={24} />
              <h2 className="text-xl tracking-tight">Project Goals</h2>
            </div>
            <p className="text-3xl font-bold mb-4 tracking-tight">
              $12,650 <span className="text-red-100 dark:text-red-200 text-2xl">/ $20,000</span>
            </p>
            <p className="mb-2 text-sm tracking-tight">63% Completed</p>
            <div className="w-full bg-red-600 dark:bg-red-800 rounded-full h-3 mb-4">
              <div className="w-[63%] bg-red-100 dark:bg-red-300 rounded-full h-3"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="tracking-tight">New Equipment</span>
                <span className="tracking-tight">$8,000 / $10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="tracking-tight">Marketing Campaign</span>
                <span className="tracking-tight">$3,150 / $5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="tracking-tight">Community Event</span>
                <span className="tracking-tight">$1,500 / $5,000</span>
              </div>
            </div>
          </div>

          {/* Top Supporters Card */}
          <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
            <div className="flex items-center mb-4">
              <Heart className="mr-2 text-red-500 dark:text-red-400" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Top Supporters
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSupporters.map((supporter, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-900 dark:text-gray-100">{supporter.name}</TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-gray-100">
                      ${supporter.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Balance and Actions */}
          <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
            <div className="flex items-center mb-2">
              <PieChart className="mr-2 text-red-500 dark:text-red-400" size={24} />
              <h2 className="text-xl text-gray-600 dark:text-gray-300 tracking-tight">Balance</h2>
            </div>
            <p className="text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">$46,850</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 tracking-tight">
              **** 5382
            </p>
            <div className="space-y-2">
              <button className="w-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 py-2 rounded-xl font-semibold flex items-center justify-center tracking-tight">
                History <BarChart2 className="ml-2" size={18} />
              </button>
              <button className="w-full bg-red-500 dark:bg-red-600 text-white py-2 rounded-xl font-semibold flex items-center justify-center tracking-tight">
                Payouts <DollarSign className="ml-2" size={18} />
              </button>
            </div>
          </div>

          {/* Upcoming Payment */}
          <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
            <div className="flex items-center mb-2">
              <Music className="mr-2 text-red-500 dark:text-red-400" size={24} />
              <h2 className="text-xl text-gray-600 dark:text-gray-300 tracking-tight">
                Upcoming Payment
              </h2>
            </div>
            <p className="text-3xl font-bold text-red-500 dark:text-red-400 mb-1 tracking-tight">
              $120
            </p>
            <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">Spotify Premium</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-tight">Tomorrow</p>
          </div>

          {/* More ways to earn section */}
          <div className="col-span-full">
            <h2 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
              More ways to earn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-red-500 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight text-gray-900 dark:text-gray-100">
                  Membership
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 tracking-tight">
                  Monthly membership for your biggest fans and supporters.
                </p>
                <button className="bg-red-500 dark:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center tracking-tight">
                  Enable <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="text-red-500 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight text-gray-900 dark:text-gray-100">
                  Shop
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 tracking-tight">
                  Introducing Shop, the creative way to sell.
                </p>
                <button className="bg-red-500 dark:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center tracking-tight">
                  Enable <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <Edit className="text-red-500 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight text-gray-900 dark:text-gray-100">
                  Exclusive posts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 tracking-tight">
                  Publish your best content exclusively for your supporters and
                  members.
                </p>
                <button className="bg-red-500 dark:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center tracking-tight">
                  Write a post <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}