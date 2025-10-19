'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Package, Truck, HeartHandshake } from 'lucide-react';

const loadingStates = [
  {
    icon: Package,
    title: 'Processing Your Order',
    description: 'We\'re preparing your premium fashion selections',
  },
  {
    icon: CheckCircle2,
    title: 'Confirming Details',
    description: 'Ensuring everything is perfect for your business',
  },
  {
    icon: Truck,
    title: 'Preparing Shipment',
    description: 'Getting your order ready for a swift delivery',
  },
  {
    icon: HeartHandshake,
    title: 'Almost There!',
    description: 'Thank you for choosing Padmaisha as your fashion partner',
  },
];

interface OrderLoadingScreenProps {
  onLoadingComplete?: () => void;
}

const OrderLoadingScreen = ({ onLoadingComplete }: OrderLoadingScreenProps) => {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStateIndex((prev) => {
        if (prev === loadingStates.length - 1) {
          if (onLoadingComplete) {
            onLoadingComplete();
          }
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-white via-purple-50 to-pink-50"
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStateIndex + 1) / loadingStates.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStateIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-6"
              >
                {React.createElement(loadingStates[currentStateIndex].icon, {
                  size: 48,
                  className: "mx-auto text-purple-600",
                  strokeWidth: 1.5
                })}
              </motion.div>

              {/* Text Content */}
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {loadingStates[currentStateIndex].title}
              </h2>
              <p className="text-gray-600">
                {loadingStates[currentStateIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Dots */}
        <div className="mt-8 flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-purple-600"
            />
          ))}
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 2,
              }}
              className="absolute w-64 h-64 rounded-full border border-purple-200"
              style={{
                left: `${30 + i * 10}%`,
                top: `${20 + i * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderLoadingScreen;
