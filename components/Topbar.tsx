"use client";
import ThemeToggle from "./ThemeToggle";
import { Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#23232b] shadow">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg text-gray-800 dark:text-white">Admin Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          {/* Notification badge */}
        </button>
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-semibold">
            {user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <span className="text-gray-700 dark:text-gray-200">{user?.email || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
