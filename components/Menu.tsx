import { useState } from "react";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
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
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", link: "/dashboard/"},
  { icon: ExternalLink, label: "View page", link: /{profile.username}/ },
  { icon: Grid, label: "Explore creators" },
  { label: "MONETIZE", isHeader: true },
  { icon: Heart, label: "Supporters", link: "/dashboard/"},
  { icon: Lock, label: "Memberships", link: "/dashboard/" },
  { icon: ShoppingBag, label: "My Shop", link: "/dashboard/" },
  { icon: Edit, label: "Publish", hasDropdown: true },
  { label: "SETTINGS", isHeader: true },
  { icon: Sliders, label: "Widgets & Graphics", link: "/dashboard/" },
  { icon: Zap, label: "Integrations", link: "/dashboard/" },
  { icon: DollarSign, label: "Payouts", link: "/dashboard/" },
  { icon: Settings, label: "Settings", link: "/dashboard/" },
];

export function ProfileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button
              key={index} onClick={() => window.open(`https://supportthis.org/${item.link}/`)}
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

      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full m-2 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80"
        >
          <MenuIcon size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </>
  );
}