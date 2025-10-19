'use client';
import React, { useState, useEffect } from 'react';

const NotificationBar = () => {
  const notifications = [
    "Ramesh Kumar from Ahmedabad placed an order",
    "Priya Sharma from Delhi just booked a service",
    "Arjun Verma from Chandigarh purchased a product",
    "Neha Kapoor from Mumbai confirmed her order",
    "Rohit Mehta from Pune placed an order",
    "Kavya Singh from Lucknow bought a treatment",
    "Aman Jain from Jaipur placed an order",
    "Sneha Patel from Surat booked a service",
    "Mohit Khanna from Bangalore placed an order",
    "Anjali Yadav from Hyderabad purchased a product",
    "Karan Malhotra from Noida confirmed his order",
    "Ritu Sharma from Kolkata booked a service",
    "Aditya Nair from Kochi placed an order",
    "Swati Gupta from Indore purchased a product",
    "Harsh Chawla from Bhopal placed an order",
    "Simran Kaur from Ludhiana booked a treatment",
    "Deepak Reddy from Vizag purchased a product",
    "Tanya Arora from Gurgaon placed an order",
    "Vikas Pandey from Patna booked a service",
    "Meera Joshi from Nagpur placed an order"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-4 overflow-x-auto whitespace-nowrap">
          <span className="px-2">★ 12% OFF on New Arrivals</span>
          <span className="w-px h-4 bg-white/30"></span>
          <span className="px-2">Free Shipping on Orders Above ₹2000</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;