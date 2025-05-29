import { ORDER_URL } from '@/lib/constants';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Get order details from our backend
    const orderResponse = await fetch(`${ORDER_URL}/session/${sessionId}`);
    const orderData = await orderResponse.json();
    
    return NextResponse.json({
      orderId: orderData.data.order.orderId,
      email: session.customer_email,
      amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : 0.00,
      status: orderData.data.order.status
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
