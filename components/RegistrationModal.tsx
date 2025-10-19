'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const RegistrationModal = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
  name: '',
  phone: '',
  gst: '',
  address: ''
  });
  const [loading, setLoading] = useState(false);
  // Removed password field for survey form

  if (!state.showRegistrationModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate GST format
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gstPattern.test(formData.gst)) {
      toast.error('Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Save user to Firestore 'orders' collection for dashboard visibility
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "orders"), {
        user: {
          name: formData.name,
          phone: formData.phone,
          gst: formData.gst,
          address: formData.address,
          isRegistered: true,
          discount: 12,
        },
        status: {
          contacted: false,
          fulfilled: false,
          order_placed: false,
          notes: "",
        },
        order_details: {
          items: [],
          total_amount: 0,
          date: serverTimestamp(),
        },
        created_at: serverTimestamp(),
      });
    } catch (err) {
      toast.error("Failed to save registration. Please try again.");
      setLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      gst: formData.gst,
      address: formData.address,
      isRegistered: true,
      discount: 12
    };

    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'TOGGLE_REGISTRATION_MODAL', payload: false });
    toast.success('Registration successful! You got 12% discount on all orders!');
    setLoading(false);
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_REGISTRATION_MODAL', payload: false });
    toast.info('You can register later at checkout to get 12% discount');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Retailer!</h2>
          <p className="text-gray-600">Register now to get an extra 12% flat discount on all orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="GST Number (e.g., 22AAAAA0000A1Z5)"
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
              required
              className="w-full"
            />
          </div>

          <div>
            <Textarea
              placeholder="Business Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full min-h-[80px]"
            />
          </div>

          {/* Password field removed for survey form */}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary ripple"
            >
              {loading ? 'Registering...' : 'Register & Get 12% Off'}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;