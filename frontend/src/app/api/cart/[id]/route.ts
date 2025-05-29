import { CART_URL } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const response = await fetch(`${CART_URL}/${id}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ type: 'Error', msg: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const response = await fetch(`${CART_URL}/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ type: 'Error', msg: 'Failed to remove from cart' }, { status: 500 });
  }
}