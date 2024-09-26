"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  Coffee,
  Music,
  Film,
  CreditCard,
  HelpCircle,
  ExternalLink,
  Heart,
  Lock,
  ShoppingBag,
  Edit,
  Sliders,
  Zap,
  DollarSign,
  Settings,
  ChevronDown,
  ArrowRight,
  BarChart2,
  PieChart,
  TrendingUp,
  Target,
  Crown,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { ProfileMenu } from "./Menu";
import { VisitsChart } from "@/components/VisitsChart";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const topSupporters = [
  { name: "Alice Johnson", amount: 500 },
  { name: "Bob Smith", amount: 450 },
  { name: "Charlie Brown", amount: 400 },
  { name: "Diana Ross", amount: 350 },
  { name: "Ethan Hunt", amount: 300 },
];

export function DashboardComponent() {
            const { data: session, status } = useSession();
            const router = useRouter();
            const [profile, setProfile] = useState({
              name: "",
              email: "",
              username: "",
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
            const [scrollY, setScrollY] = useState(0);

            useEffect(() => {
              if (status === "authenticated") {
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
                const response = await fetch("/api/profile");
                if (response.ok) {
                  const data = await response.json();
                  setProfile(data);
                } else {
                  console.error("Failed to fetch profile");
                }
              } catch (error) {
                console.error("An unexpected error occurred", error);
              }
            };

            const getInitials = (name: string) => {
              const names = name.split(" ");
              if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
              }
              return name.slice(0, 2).toUpperCase();
            };

            if (status === "unauthenticated") {
              router.push("/signin");
              return null;
            }

            return (
              <div className="bg-red-50 dark:bg-gray-900 min-h-screen flex text-base">
                <ProfileMenu />

                {/* Main Content */}
                <div className="flex-1">
                  {/* Top Bar */}
                  <div className="flex flex-col md:flex-row items-start md:items-center p-6 mb-4 md:mt-8">
                    <Avatar className="w-10 h-10 md:w-16 md:h-16 mr-4 mb-8 md:mb-0">
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={
                          profile.avatarImage || "/placeholder.svg?height=128&width=128"
                        }
                        alt={profile.name}
                      />
                      <AvatarFallback>
                        {profile.name ? getInitials(profile.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Welcome back, {profile.name || "👋"}!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 tracking-tight text-base md:text-lg">
                        Here's your dashboard summary
                      </p>
                    </div>
                  </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                      {/* Statistics Card */}
                      <VisitsChart />

          {/* Financial Metrics Card */}
          <div className="bg-red-100 dark:bg-red-900 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow relative">
            <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full"></div>
            </div>
            <div className="flex items-center mb-4">
              <TrendingUp
                className="mr-2 text-red-500 dark:text-red-400"
                size={24}
              />
              <h2 className="text-gray-600 dark:text-gray-300 text-xl tracking-tight">
                Financial Metrics
              </h2>
            </div>
            <p className="text-5xl font-bold mb-2 tracking-tight text-gray-900 dark:text-gray-100">
              $12,650
            </p>
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
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  $1,200
                </p>
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
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  $3,500
                </p>
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
                <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  $7,950
                </p>
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
              $12,650{" "}
              <span className="text-red-100 dark:text-red-200 text-2xl">
                / $20,000
              </span>
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
              <Crown
                className="mr-2 text-red-500 dark:text-red-400"
                size={24}
              />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Top Supporters
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSupporters.map((supporter, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {supporter.name}
                    </TableCell>
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
              <PieChart
                className="mr-2 text-red-500 dark:text-red-400"
                size={24}
              />
              <h2 className="text-xl text-gray-600 dark:text-gray-300 tracking-tight">
                Balance
              </h2>
            </div>
            <p className="text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
              $46,850
            </p>
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
              <Music
                className="mr-2 text-red-500 dark:text-red-400"
                size={24}
              />
              <h2 className="text-xl text-gray-600 dark:text-gray-300 tracking-tight">
                Upcoming Payment
              </h2>
            </div>
            <p className="text-3xl font-bold text-red-500 dark:text-red-400 mb-1 tracking-tight">
              $120
            </p>
            <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Spotify Premium
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-tight">
              Tomorrow
            </p>
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
                  <ShoppingBag
                    className="text-red-500 dark:text-red-400"
                    size={24}
                  />
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
