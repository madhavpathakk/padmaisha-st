'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Users, DollarSign, BarChart2, ClipboardList, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: DollarSign, label: 'Revenue', href: '/admin/revenue' },
  { icon: BarChart2, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: 1
    }
  }
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: -16
  },
  open: {
    opacity: 1,
    x: 0
  }
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 256 }}
      className="h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4"
    >
      {/* Logo */}
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="Padmaisha Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            Padmaisha
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <motion.nav
        initial="closed"
        animate="open"
        variants={sideVariants}
        className="space-y-1"
      >
        {menuItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          
          return (
            <motion.div key={href} variants={itemVariants}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    className="absolute left-0 w-1 h-8 bg-purple-600 dark:bg-purple-400 rounded-r"
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Version Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Version 1.0.0</p>
          <p>© 2025 Padmaisha. All rights reserved.</p>
        </div>
      </div>
    </motion.div>
  );
}
