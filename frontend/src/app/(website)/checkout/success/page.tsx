'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrderDetailsResponse } from '../../../../../types'
import { emptyCart } from '@/app/cartSlice';
import { useDispatch } from 'react-redux';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getOrderDetails = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
          const data = await response.json();
          setOrderDetails(data);

          //empty cart
          await dispatch(emptyCart());

        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getOrderDetails();
  }, [dispatch, sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase</p>
        </div>

        {orderDetails && (
          <div className="border-t border-b py-4 my-4">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="mb-2"><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
            <p className="mb-2"><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {orderDetails.email}</p>
            <p><span className="font-medium">Total:</span> ${orderDetails.amount}</p>
          </div>
        )}

        <p className="text-center mt-6">
          A confirmation email has been sent to your email address.
        </p>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-6 rounded font-semibold hover:bg-blue-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
