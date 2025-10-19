"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  description?: string;
  percentageChange?: number;
};

export default function StatsCard({ title, value, icon, color, description, percentageChange }: StatsCardProps) {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-900 dark:text-white mt-1"
          >
            {value}
          </motion.p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className={`p-3 rounded-lg ${color} bg-opacity-10`}
        >
          {icon}
        </motion.div>
      </div>

      {percentageChange !== undefined && (
        <div className="flex items-center mt-2">
          {percentageChange > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              percentageChange > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {Math.abs(percentageChange)}% vs last period
          </span>
        </div>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`h-2 rounded-full ${color}`}
        />
      </motion.div>
    </div>
  );
}
