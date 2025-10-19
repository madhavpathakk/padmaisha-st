'use client';

import { motion, useIsPresent } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const isPresent = useIsPresent();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const footerSections = {
    quickLinks: [
      { name: 'Track Your Order', href: '/track-order' },
      { name: 'Exchange Your Order', href: '/exchange-order' },
      { name: 'Contact us', href: '/contact' }
    ],
    policies: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Exchange Policy', href: '/exchange-policy' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' }
    ],
    categories: [
      { name: 'Western Wear', href: '/products?category=western' },
      { name: 'Ethnic Wear', href: '/products?category=ethnic' },
      { name: 'Activewear', href: '/products?category=active' },
      { name: 'Accessories', href: '/products?category=accessories' }
    ]
  };

  const contactInfo = [
    {
      icon: MapPin,
      text: 'B/246 Sooraj bhan school, Rajendra Nagar Bareilly, Pin code - 243001'
    },
    {
      icon: Phone,
      text: '8979865001 / 9760025104'
    },
    {
      icon: Mail,
      text: 'padmaisha940@gmail.com'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
      {/* Newsletter Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={false}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 md:p-12 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Subscribe to our newsletter
                </h2>
                <p className="text-purple-100">
                  Join our email list for exclusive offers and the latest news
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 w-full sm:w-64 bg-white"
                    autoComplete="off"
                  />
                  <button
                    className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                  >
                    Subscribe
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerSections.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="space-y-3">
              {footerSections.policies.map((policy, index) => (
                <li key={index}>
                  <Link 
                    href={policy.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-3">
              {footerSections.categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    href={category.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <info.icon className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{info.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6"
            >
              {socialLinks.map((social, index) => (
                <Link 
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-right text-sm text-gray-500"
            >
              <p>© 2023 Padmaisha. All rights reserved.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600">10:30 AM to 8:30 PM</p>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
