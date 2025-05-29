'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store'
import { removeFromCart, updateCartQuantity } from '../../cartSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart, loading, error } = useSelector((state: RootState) => state.cart);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId) as any);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity >= 1) {
      dispatch(updateCartQuantity({ productId, quantity }) as any);
    }
  };

//   if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0) return <div className="text-center py-10">Your cart is empty</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid gap-6">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-24 h-24 relative">
              <Image
                src={ item?.image ? getImageUrl(item?.image) : '/placeholder.jpg'}
                alt={item.name || 'Product'}
                fill
                className="object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name || 'Product'}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  className="px-2 py-1 border rounded cursor-pointer"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  className="px-2 py-1 border rounded cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">${item.total.toFixed(2)}</p>
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-500 hover:text-red-700 mt-2 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Subtotal:</span>
          <span className="text-lg font-semibold">${cart.subTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}