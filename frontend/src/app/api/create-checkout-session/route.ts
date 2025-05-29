import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem, CustomerInfo } from '../../../../types'
import { ORDER_URL } from '@/lib/constants';
import { emptyCart } from '@/app/cartSlice';

interface RequestBody {
  items: CartItem[];
  customerInfo: CustomerInfo;
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2023-10-16', // Use the latest Stripe API version
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const data: RequestBody = await request.json();
    const { items, customerInfo } = data;
    
    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: customerInfo.email,
      metadata: {
        name: customerInfo.name,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        country: customerInfo.country,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    // Call our backend to save the order in MongoDB
    await fetch(`${ORDER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        customerInfo,
        items,
        status: 'pending',
        totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}