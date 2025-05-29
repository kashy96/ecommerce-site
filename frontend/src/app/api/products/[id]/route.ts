import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`http://your-backend-url/api/products/${params.id}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ type: 'Error', msg: 'Failed to fetch product' }, { status: 500 });
  }
}