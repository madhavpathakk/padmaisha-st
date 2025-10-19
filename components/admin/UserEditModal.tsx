import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface UserStatus {
  contacted?: boolean;
  fulfilled?: boolean;
  order_placed?: boolean;
  returned?: boolean;
  replaced?: boolean;
  notes?: string;
}

interface UserData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gst?: string;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData | null;
  onSuccess: () => void;
}

export default function UserEditModal({ isOpen, onClose, user, onSuccess }: Props) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    gst: '',
    status: {
      contacted: false,
      fulfilled: false,
      order_placed: false,
      returned: false,
      replaced: false,
      notes: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        gst: user.gst || '',
        status: {
          contacted: user.status?.contacted || false,
          fulfilled: user.status?.fulfilled || false,
          order_placed: user.status?.order_placed || false,
          returned: user.status?.returned || false,
          replaced: user.status?.replaced || false,
          notes: user.status?.notes || '',
        }
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        gst: '',
        status: {
          contacted: false,
          fulfilled: false,
          order_placed: false,
          returned: false,
          replaced: false,
          notes: '',
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.phone) {
        throw new Error('Name and Phone are required');
      }

      if (user?.id) {
        // Update existing user
        const updateData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          gst: formData.gst,
          status: formData.status,
          updatedAt: new Date()
        }
        await updateDoc(doc(db, 'users', user.id), updateData);
        toast.success('User updated successfully');
      } else {
        // Create new user
        const userId = `user_${Date.now()}`;
        await setDoc(doc(db, 'users', userId), {
          ...formData,
          id: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('User created successfully');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
      toast.error(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', user.id));
      toast.success('User deleted successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status.contacted}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: { ...prev.status, contacted: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Contacted</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status.fulfilled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: { ...prev.status, fulfilled: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Fulfilled</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status.order_placed}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: { ...prev.status, order_placed: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Order Placed</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status.returned}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: { ...prev.status, returned: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Returned</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.status.replaced}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: { ...prev.status, replaced: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Replaced</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={formData.status.notes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      status: { ...prev.status, notes: e.target.value }
                    }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {user?.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Delete User
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : user ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
