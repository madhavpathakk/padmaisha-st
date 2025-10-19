import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,0,0,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(0,0,255,0.1),transparent_70%)]" />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Content */}
        <motion.div className="w-full md:w-1/2 space-y-8" variants={itemVariants}>
          <div className="space-y-4">
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="w-4 h-4 text-pink-400 mr-2" />
              <span className="text-sm font-medium">Premium B2B Fashion Platform</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              UNLEASH YOUR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                RETAIL STYLE
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
              Experience premium B2B clothing with exclusive brands and competitive prices designed for ambitious retailers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#brands-section"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Brands
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/20 hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Pricing
            </motion.a>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { number: "500+", label: "Products" },
              { number: "20+", label: "Brands" },
              { number: "1000+", label: "Retailers" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                variants={itemVariants}
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - Image */}
        <motion.div 
          className="w-full md:w-1/2 mt-12 md:mt-0"
          variants={itemVariants}
        >
          <div className="relative">
            <motion.img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop"
              alt="Fashion Model"
              className="rounded-2xl shadow-2xl max-w-md mx-auto"
              style={{ 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
