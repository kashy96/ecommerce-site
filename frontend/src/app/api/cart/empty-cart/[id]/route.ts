import { CART_URL } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE /api/cart/empty-cart/[id] called with id:', params.id);

    const contentLength = request.headers.get('content-length');
    let body = {};
    if (contentLength && parseInt(contentLength) > 0) {
      body = await request.json();
    }

    const response = await fetch(`${CART_URL}/empty-cart/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error('Error in DELETE /api/cart/empty-cart:', err.message);
    return NextResponse.json({ type: 'Error', msg: 'Failed to empty cart' }, { status: 500 });
  }
}