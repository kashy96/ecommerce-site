import React from 'react'
import {
  Card,
} from "@/components/ui/card"
import { fetchSiteProducts } from '@/lib'

import ProductCard from '@/components/product/product-card';

const page = async({params}:{
    params: { slug: string };
}) => {
  const category: string = params.slug;  
  const products: Product[] = await fetchSiteProducts(category)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product}/>
        ))
      ) : (
        // Fallback example product when no products are loaded
        <Card className="relative group">
          <p className='text-lg'>No products found</p>
        </Card>
      )}
    </div>
  );
}

export default page
