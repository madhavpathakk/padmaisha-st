'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Hero Section */}
      <div className="bg-white w-full">
        <div className="w-full px-2 sm:px-4 md:px-8 py-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our B2B fashion solutions? We're here to help you grow your retail business.
            </p>
          </div>
        </div>
      <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-white via-blue-50 to-pink-50 border-b border-gray-200 shadow-md px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg text-blue-700 hover:text-pink-600 transition">← Back to Homepage</Link>
      </div>
  </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  setLoading(true);
                  const form = event.target as HTMLFormElement;
                  const formData = new FormData(form);
                  formData.append("access_key", "ab6cd849-c4a1-4bd3-b511-b6997843473b");
                  const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                  });
                  const data = await response.json();
                  if (data.success) {
                    setResult("Form Submitted Successfully");
                    toast.success("Form Submitted Successfully");
                    form.reset();
                  } else {
                    setResult(data.message || "Error submitting form");
                    toast.error(data.message || "Error submitting form");
                  }
                  setLoading(false);
                }}
                className="space-y-6"
              >
                <input type="hidden" name="to" value="padmaisha940@gmail.com" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input name="name" placeholder="Your Name" required />
                  <Input name="email" type="email" placeholder="Email Address" required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input name="company" placeholder="Company Name" />
                  <Input name="phone" type="tel" placeholder="Phone Number" />
                </div>
                <Input name="subject" placeholder="Subject" />
                <Textarea name="message" placeholder="Your Message" required className="min-h-[120px]" />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600"
                  size="lg"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
                <span>{result}</span>
                <AnimatePresence>
                  {result === 'Form Submitted Successfully' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center mt-4"
                    >
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#22c55e" />
                        <path d="M18 32L27 41L42 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-green-600 font-semibold text-lg mt-2">Thank you! Your message was sent.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            {/* End of Contact Form CardContent/Card */}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">padmaisha940@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">8979865001</p>
                      <p className="text-gray-600">Alternate: 9760025104</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-gray-600">
                        B/246 Sooraj bhan school<br />
                        Rajendra Nagar Bareilly<br />
                        Pin code - 243001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600">10:30 to 8:30 pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Need Quick Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sales Inquiries</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Want to become a retailer or need bulk pricing information?
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Sales Team
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Technical Support</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Having trouble with your account or orders?
                    </p>
                    <Button variant="outline" size="sm">
                      Get Technical Help
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Partnership</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Interested in becoming a brand partner?
                    </p>
                    <Button variant="outline" size="sm">
                      Partner with Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
        <div className="mt-16 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 lg:h-96 bg-gray-200 relative">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=400&fit=crop"
              alt="Office Location"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <h3 className="text-xl font-bold mb-2">Visit Our Office</h3>
                <p className="text-gray-600">
                  B/246 Sooraj bhan school<br />
                  Rajendra Nagar Bareilly<br />
                  Pin code - 243001
                </p>
                <Button className="mt-4 bg-red-500 hover:bg-red-600">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;