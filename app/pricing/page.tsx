'use client';
import React from 'react';
import { Check, Star, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

const PricingPage = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for small retailers getting started',
      features: [
        'Access to 5 brands',
        'Up to 50 products',
        'Basic customer support',
        'Standard shipping',
        '30-day return policy'
      ],
      popular: false,
      buttonText: 'Get Started Free'
    },
    {
      name: 'Professional',
      price: 2999,
      description: 'Ideal for growing retail businesses',
      features: [
        'Access to all 20+ brands',
        'Unlimited products',
        'Priority customer support',
        'Free shipping on orders above ₹1000',
        '45-day return policy',
        'Bulk order discounts up to 15%',
        'Dedicated account manager',
        'Monthly trend reports'
      ],
      popular: true,
      buttonText: 'Start Professional'
    },
    {
      name: 'Enterprise',
      price: 4999,
      description: 'For large retailers and chains',
      features: [
        'Everything in Professional',
        'Custom payment terms',
        'White-label packaging options',
        'Exclusive product lines',
        'Advanced analytics dashboard',
        'API access for integration',
        '24/7 phone support',
        'Quarterly business reviews'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Choose the perfect plan for your retail business. All plans include our premium B2B features with no hidden costs.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2"
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Special Launch Offer: 20% off first 3 months
              </Badge>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 py-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
              >
                <Card 
                  className={`relative group ${
                    plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  } hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 shadow-lg flex items-center gap-2">
                        <Star className="h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold">₹{plan.price.toLocaleString()}</span>
                      {plan.price > 0 && <span className="text-gray-600 ml-1">/month</span>}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="rounded-full p-1 bg-green-100">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      } transform transition-all duration-300 hover:scale-105`}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {/* Why Choose Padmaisha */}
          <motion.div
            variants={itemVariants}
            className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12"
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
                Why Choose Padmaisha?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide more than just products - we're your complete B2B fashion partner.
              </p>
            </motion.div>
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-12"
            >
              {[
                {
                  icon: "🔒",
                  title: "Secure & Reliable",
                  description: "Your business data is safe with enterprise-grade security",
                  bgColor: "bg-blue-100"
                },
                {
                  icon: "📞",
                  title: "24/7 Support",
                  description: "Get help whenever you need it from our dedicated support team",
                  bgColor: "bg-green-100"
                },
                {
                  icon: "📈",
                  title: "Grow Your Business",
                  description: "Access to tools and insights to help scale your retail business",
                  bgColor: "bg-purple-100"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            variants={itemVariants}
            className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent text-center mb-12"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              variants={containerVariants}
              className="space-y-8 max-w-3xl mx-auto"
            >
              {[
                {
                  question: "Can I change my plan later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  question: "Is there a minimum order requirement?",
                  answer: "Starter plan has a minimum order of ₹5,000. Professional and Enterprise plans have no minimum order requirements."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, bank transfers, and UPI. Enterprise customers can also set up custom payment terms."
                },
                {
                  question: "Do you offer custom solutions?",
                  answer: "Yes, our Enterprise plan includes custom solutions. Contact our sales team to discuss your specific requirements."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              variants={itemVariants}
              className="mt-16 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-8">Our team is happy to help you find the perfect plan for your business.</p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Contact Sales Team
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;