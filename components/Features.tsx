import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Star, 
  Shield, 
  Clock, 
  Truck, 
  CreditCard 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Premium Quality',
      description: 'High-quality fashion from trusted brands',
      gradient: 'from-pink-500 to-red-500',
      delay: 0
    },
    {
      icon: TrendingUp,
      title: 'Competitive Prices',
      description: 'Best wholesale prices for retailers',
      gradient: 'from-purple-500 to-blue-500',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'B2B Focused',
      description: 'Designed specifically for retailers',
      gradient: 'from-green-500 to-teal-500',
      delay: 0.2
    },
    {
      icon: Star,
      title: 'Trusted by 1000+',
      description: 'Retailers across the country',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Safe & secure transactions',
      gradient: 'from-cyan-500 to-blue-500',
      delay: 0.4
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Quick & reliable delivery',
      gradient: 'from-rose-500 to-pink-500',
      delay: 0.6
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Multiple payment options',
      gradient: 'from-amber-500 to-orange-500',
      delay: 0.7
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            Why Choose Padmaisha?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Elevate your retail business with our premium features and services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                <div className={`w-12 h-12 mb-6 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(feature.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
