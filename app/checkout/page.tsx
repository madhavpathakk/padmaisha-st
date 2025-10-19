"use client";
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import OrderLoadingScreen from '@/components/OrderLoadingScreen';

const CheckoutPage: React.FC = () => {
  const { state, user, dispatch } = useApp();
  const router = useRouter();
      
      // Continue with the const cartItems = state.cart || [];
  const cartItems = state.cart || [];
  const cartTotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const platformFee = 20;
  const deliveryCharges = cartTotal > 2000 ? 0 : 50;
  const finalTotal = cartTotal + platformFee + deliveryCharges;

  const expectedDeliveryDate = new Date();
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 6);

  // Initialize form data with user's saved info
    // Initialize form data
  const [formData, setFormData] = React.useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    pincode: "",
    gstNumber: "",
  });

  // Load saved address if available
  React.useEffect(() => {
    if (user?.uid) {
      const getStoredAddress = async () => {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData(prev => ({
            ...prev,
            fullName: userData.name || prev.fullName,
            phoneNumber: userData.phone || prev.phoneNumber,
            address: userData.address || prev.address,
            pincode: userData.pincode || prev.pincode,
            gstNumber: userData.gst || prev.gstNumber,
          }));
        }
      };
      getStoredAddress();
    }
  }, [user]);

  // Load saved address if available
  React.useEffect(() => {
    if (user?.uid) {
      const getStoredAddress = async () => {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData(prev => ({
            ...prev,
            fullName: userData.name || user?.displayName || prev.fullName,
            phoneNumber: userData.phone || user?.phoneNumber || prev.phoneNumber,
            address: userData.address || prev.address,
            pincode: userData.pincode || prev.pincode,
            gstNumber: userData.gst || prev.gstNumber,
          }));
        }
      };
      getStoredAddress();
    }
  }, [user]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!user?.uid) {
      toast.error("Please login to continue with checkout.", {
        style: { fontSize: '1rem', fontWeight: 500, borderRadius: 8, background: '#fff', color: '#d32f2f', boxShadow: '0 2px 8px #0001' },
        icon: '🔒',
      });
      setTimeout(() => {
        router.push("/login?redirect=/cart");
      }, 1200);
      return;
    }

    const { fullName, phoneNumber, address, pincode, gstNumber } = formData;
    if (!fullName || !phoneNumber || !address || !pincode) {
      toast.error("Please fill all the required details to place the order.", {
        style: { fontSize: '1rem', fontWeight: 500, borderRadius: 8, background: '#fff', color: '#d32f2f', boxShadow: '0 2px 8px #0001' },
        icon: '⚠️',
      });
      return;
    }

    setLoading(true);
    try {
      const { doc, setDoc, serverTimestamp, collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Start showing the loading screen immediately
      document.body.style.overflow = 'hidden';

      // Create order document with current timestamp
      const now = Date.now();
      const orderId = `${now}-${Math.random().toString(36).substring(2, 15)}`;

      // Prepare user data
      const userData = {
        name: fullName,
        phone: phoneNumber,
        address,
        pincode,
        gst: gstNumber || null,
        lastOrderAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Prepare order data
      const orderData = {
        id: orderId,
        userId: user.uid,
        user: {
          ...userData,
          uid: user.uid,
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.image,
          totalPrice: item.price * item.quantity,
          brand: item.brand,
          category: item.category
        })),
        total: finalTotal,
        subtotal: cartTotal,
        platformFee,
        deliveryCharges,
        status: 'Pending',
        createdAt: serverTimestamp(),
        timestamp: now,
        orderDate: new Date().toISOString(),
        paymentStatus: 'Pending',
        orderStatus: 'Placed',
        address: {
          address,
          pincode,
          name: fullName,
          phone: phoneNumber,
          gst: gstNumber
        }
      };

      // Save in multiple places using a batch
      const { writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(db);

      // Update user doc
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, userData, { merge: true });

      // Add to user's orders
      const userOrderRef = doc(db, 'users', user.uid, 'orders', orderId);
      batch.set(userOrderRef, orderData);

      // Add to global orders collection
      const globalOrderRef = doc(db, 'orders', orderId);
      batch.set(globalOrderRef, orderData);

      // Create audit log
      const auditRef = collection(db, 'audit_logs');
      batch.set(doc(auditRef), {
        action: 'Order Placed',
        orderId,
        userId: user.uid,
        timestamp: serverTimestamp(),
        details: {
          total: finalTotal,
          items: orderData.items.length
        }
      });

      // Commit all writes
      await batch.commit();

      // Function to format order items for email
      const formatItemsList = (items: any[]) => {
        return items.map(item => {
          const discount = item.originalPrice ? 
            ((item.originalPrice - item.price) / item.originalPrice * 100).toFixed(0) + '%' :
            'No discount';
            
          return `
• ${item.name}
  - Size: ${item.selectedSize || 'N/A'}
  - Color: ${item.color || 'N/A'}
  - Quantity: ${item.quantity}
  - Price: ₹${item.price.toLocaleString('en-IN')}
  - Original Price: ₹${(item.originalPrice || item.price).toLocaleString('en-IN')}
  - Discount: ${discount}
  - Total: ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
        }).join('\n');
      };

      // Prepare email content for admin
      const adminEmailData = {
        access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
        from_name: 'Padmaisha Store',
        subject: `🛍️ New Order #${orderId} - ₹${finalTotal.toLocaleString('en-IN')}`,
        to: 'padmaisha940@gmail.com'
      };
      
      // Prepare email content
      const adminEmailContent = `
📦 NEW ORDER RECEIVED

Order Details:
=============
Order ID: #${orderId}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Status: Pending

Customer Information:
==================
Name: ${fullName}
Phone: ${phoneNumber}
${gstNumber ? `GST: ${gstNumber}` : ''}

Items Ordered:
============
${formatItemsList(cartItems)}

Order Summary:
============
Subtotal: ₹${cartTotal.toLocaleString('en-IN')}
Platform Fee: ₹${platformFee.toLocaleString('en-IN')}
Delivery Charges: ₹${deliveryCharges.toLocaleString('en-IN')}
Total Amount: ₹${finalTotal.toLocaleString('en-IN')}

Delivery Address:
==============
${fullName}
${address}
${pincode}
Phone: ${phoneNumber}

Order Management:
==============
Admin Dashboard: ${window.location.origin}/admin/orders

This is an automated notification from your Padmaisha Store system.
`;

      const customerEmailContent = `
Dear ${fullName},

Thank you for shopping with Padmaisha Store! Your order has been successfully placed.

Order Details:
=============
Order ID: #${orderId}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Your Order:
==========
${formatItemsList(cartItems)}

Order Summary:
============
Subtotal: ₹${cartTotal.toLocaleString('en-IN')}
Platform Fee: ₹${platformFee.toLocaleString('en-IN')}
Delivery Charges: ₹${deliveryCharges.toLocaleString('en-IN')}
Total Amount: ₹${finalTotal.toLocaleString('en-IN')}

Delivery Address:
==============
${fullName}
${address}
${pincode}
Phone: ${phoneNumber}

Expected Delivery:
===============
Your order is expected to be delivered by ${expectedDeliveryDate.toDateString()}.

Track Your Order:
==============
You can track your order status here: ${window.location.origin}/track-order

Need Help?
=========
If you have any questions about your order, please contact us at:
Email: support@padmaisha.com
Phone: +91-XXXXXXXXXX

Thank you for choosing Padmaisha Store!

Note: This is an automated email. Please do not reply to this message.
`;

      // Send emails using Web3Forms API
      try {
        // Send admin notification
        const adminEmailResponse = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
            from_name: 'Padmaisha Store',
            subject: `🛍️ New Order #${orderId} - ₹${finalTotal.toLocaleString('en-IN')}`,
            to: 'padmaisha940@gmail.com',
            message: adminEmailContent,
            replyto: user?.email
          })
        });

        const adminResult = await adminEmailResponse.json();
        if (!adminResult.success) {
          console.error('Failed to send admin notification:', adminResult);
        }

        // Send customer notification if email is available
        if (user?.email) {
          const customerEmailResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
              from_name: 'Padmaisha Store',
              subject: `Order Confirmation - #${orderId}`,
              to: user.email,
              message: customerEmailContent
            })
          });

          const customerResult = await customerEmailResponse.json();
          if (!customerResult.success) {
            console.error('Failed to send customer notification:', customerResult);
          }
        }
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        // Don't throw the error - we don't want to fail the order if just the emails fail
      }

      adminEmailData.message = adminEmailContent;

      // Prepare email content for customer
      const customerEmailData = {
        access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
        from_name: 'Padmaisha Store',
        subject: `Order Confirmation - #${orderId}`,
        to: user?.email || ''
      };

      customerEmailData.message = customerEmailContent;

      // Send both emails in parallel
      try {
        // Send admin email
        const adminEmailResponse = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
            from_name: 'Padmaisha Store',
            subject: `🛍️ New Order #${orderId} - ₹${finalTotal.toLocaleString('en-IN')}`,
            to: 'padmaisha940@gmail.com',
            message: adminEmailContent,
            replyto: user.email || undefined
          })
        });

        const adminResult = await adminEmailResponse.json();
        if (!adminResult.success) {
          console.error('Failed to send admin notification:', adminResult);
        }

        // Send customer email if user has email
        if (user.email) {
          const customerEmailResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: 'ab6cd849-c4a1-4bd3-b511-b6997843473b',
              from_name: 'Padmaisha Store',
              subject: `Order Confirmation - #${orderId}`,
              to: user.email,
              message: customerEmailContent
            })
          });

          const customerResult = await customerEmailResponse.json();
          if (!customerResult.success) {
            console.error('Failed to send customer notification:', customerResult);
          }
        }
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        // Don't throw the error - we don't want to fail the order if just the emails fail
      }

      // Clear the cart and show success message
      dispatch({ type: 'CLEAR_CART' });
      
      // Show success toast with order ID
      toast.success(
        `Order #${orderId} placed successfully!`, 
        {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          }
        }
      );

      // Keep the loading screen for a moment to show the success state
      await new Promise(resolve => setTimeout(resolve, 2000));
      document.body.style.overflow = '';
      router.push("/profile/orders");

    } catch (error: any) {
      document.body.style.overflow = '';
      console.error('Error placing order:', error);
      toast.error(
        error?.message || "Failed to place order. Please try again.",
        {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <OrderLoadingScreen />}
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {/* User Details Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your pincode"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GST Number (Optional)</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your GST number"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Product Details Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Product Details</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            {cartItems.map((item) => (
              <div key={item.id + (item.selectedSize ? '-' + item.selectedSize : '')} className="flex items-center mb-4">
                <img src={item.image || '/product-images/default.jpg'} alt={item.name} className="w-16 h-16 rounded-md mr-4" />
                <div>
                  <p className="text-lg font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Discount Applied: ₹{item.originalPrice ? item.originalPrice - item.price : 0}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="text-right">
              <p className="text-lg font-bold">Total Price: ₹{cartTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Price Details Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Price Details</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Platform Fee</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharges.toLocaleString()}</span>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Date Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Expected Delivery Date</h2>
          <p className="text-lg">{expectedDeliveryDate.toDateString()}</p>
        </div>

        {/* Place Order Section */}
        <div className="text-center">
          <button
            onClick={handlePlaceOrder}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Placing your order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;

<style jsx>{`
  @media (max-width: 768px) {
    .max-w-4xl {
      max-width: 100vw !important;
      border-radius: 0 !important;
      padding: 0.5rem !important;
    }
    .p-6 {
      padding: 0.5rem !important;
    }
    .mb-6 {
      margin-bottom: 1rem !important;
    }
    .text-3xl {
      font-size: 2rem !important;
    }
    .text-xl {
      font-size: 1.1rem !important;
    }
    .text-lg {
      font-size: 1rem !important;
    }
    .rounded-lg {
      border-radius: 0.7rem !important;
    }
    .shadow-md {
      box-shadow: 0 2px 8px #0001 !important;
    }
  }
`}</style>