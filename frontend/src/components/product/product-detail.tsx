"use client"
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import ProductCard from './product-card';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/app/cartSlice';
import { RootState } from '../../app/store'

export default function ProductDetail({product, relatedProducts}: {product: Product; relatedProducts: Product[]}) {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const { loading, error } = useSelector((state: RootState) => state.cart);
  const userToken = useSelector((state: RootState) => state.auth.user.token);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      dispatch(addToCart({ productId: product._id, quantity }) as any);
      setQuantity(1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-2/3">
          <div className="border rounded-md h-96 flex items-center justify-center bg-gray-50">
            <Image
                src={getImageUrl(product.image)}
                alt={product.image}
                width={600}
                height={600}
                className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/3 grid grid-rows-[1fr_auto]">
          {/* Top content */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
              ${product.price.toFixed(2)} USD
            </div>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="font-semibold">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border rounded"
              />
            </div>
          </div>

          {/* Bottom button */}
            <div>
              <Button 
                onClick={handleAddToCart}
                disabled={loading || quantity < 1 || quantity > product.stock || !userToken}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={16} />
                {loading ? 'Adding...' : 'Add to Cart'}
              </Button>
  
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

        </div>


      </div>
      
      {/* Related Products */}
      {
        relatedProducts.length ? 

        (
          <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product}/>
              ))}
            </div>
            
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        ) :  (
        <div className="mt-12 flex justify-center">
          <h2 className="text-xl font-bold mb-4">No related products found!!</h2>
        </div>)
      }
     
    </div>
  );
}