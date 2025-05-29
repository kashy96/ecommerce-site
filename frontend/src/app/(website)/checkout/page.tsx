'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const cart = useSelector((state:RootState) => state.cart.cart);
  const cartItems = cart?.items;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create session on the backend
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: formData
        }),
      });

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Country</option>
                <option value="PK">Pakistan</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded">
            {cartItems?.map((item) => (
              <div key={item.productId} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.total).toFixed(2)}</p>
              </div>
            ))}
            
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${cart?.subTotal}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mt-4 pt-2 border-t font-bold text-lg">
                <span>Total</span>
                <span>${cart?.subTotal}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">We Accept</h3>
            <div className="flex space-x-2">
              <div className="p-2 border rounded">Visa</div>
              <div className="p-2 border rounded">Mastercard</div>
              <div className="p-2 border rounded">American Express</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}