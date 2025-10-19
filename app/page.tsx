'use client';

import Testimonials from '@/components/Testimonials';
import FAQAccordion from '@/components/FAQAccordion';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, TrendingUp, Users, Star } from 'lucide-react';
import PremiumBrandsGrid from '@/components/PremiumBrandsGrid';
import AboutPadmaisha from '@/components/AboutPadmaisha';

export default function Page() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Animation */}
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <h1 className="text-4xl lg:text-6xl font-bold">
                UNLEASH YOUR
                <span className="block text-purple-600">RETAIL STYLE</span>
                WITH PADMAISHA
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Premium B2B Clothing for Retailers – Exclusive Brands, Affordable Prices
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/brands"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all"
                >
                  Browse Brands
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.a>
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all"
                >
                  View Pricing
                </motion.a>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative"
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop"
                alt="Fashion Model"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mt-12"
          >
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-purple-600 mb-2">500+</h3>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-purple-600 mb-2">20+</h3>
              <p className="text-gray-600">Brands</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-3xl font-bold text-purple-600 mb-2">1000+</h3>
              <p className="text-gray-600">Retailers</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 md:py-24 relative z-10"
      >
        <div className="container mx-auto px-4">
          <AboutPadmaisha />
        </div>
      </motion.section>

      {/* Premium Brands Section */}
      <section className="py-16 md:py-24 bg-white/80 backdrop-blur relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Premium Brands
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover exclusive fashion brands for every season, curated for retailers who demand quality and style.
            </p>
          </motion.div>

          {/* Brands Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8"
          >
            <PremiumBrandsGrid />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Padmaisha?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Elevate your retail business with premium brands, exclusive styles, and seamless B2B service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: "Premium Quality",
                description: "High-quality fashion from trusted brands",
                gradient: "from-purple-400 to-pink-400"
              },
              {
                icon: TrendingUp,
                title: "Competitive Prices",
                description: "Best wholesale prices for retailers",
                gradient: "from-blue-400 to-cyan-400"
              },
              {
                icon: Users,
                title: "B2B Focused",
                description: "Designed specifically for retailers",
                gradient: "from-green-400 to-teal-400"
              },
              {
                icon: Star,
                title: "Trusted by 1000+",
                description: "Retailers across the country",
                gradient: "from-yellow-400 to-orange-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative z-10"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Fashion Business?</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Join thousands of successful retailers who trust Padmaisha for their fashion needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.a
              href="/brands"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Shopping Now
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Contact Sales Team
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <Testimonials />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <FAQAccordion />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <Footer />
      </motion.div>
    </div>
  );
}
