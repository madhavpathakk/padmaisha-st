"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import { Home, Users, DollarSign, BarChart2, Settings, LogOut } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: DollarSign, label: "Revenue", href: "/admin/revenue" },
  { icon: BarChart2, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" }
];

export default function Sidebar() {
  const { user } = useAuth();
  function handleProtectedNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!user) {
      e.preventDefault();
      toast.error("Please sign in to access the admin panel.", {
        style: {
          borderRadius: "8px",
          background: "#fff",
          color: "#6B46C1",
          fontWeight: "bold",
          fontSize: "1rem",
          boxShadow: "0 2px 12px rgba(107,70,193,0.12)",
        },
        icon: '🔒',
        duration: 3500,
      });
    }
  }
  return (
    <aside className="w-64 bg-white dark:bg-[#23232b] shadow-lg flex flex-col min-h-screen">
      <div className="flex flex-col flex-1">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="Padmaisha Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-800 dark:text-white">Padmaisha CRM</span>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${typeof window !== 'undefined' && window.location.pathname === href
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                onClick={(e) => handleProtectedNav(e, href)}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-700">
        {user && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600">
                  {user.email?.[0].toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.email}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
            <div className="space-y-3">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
