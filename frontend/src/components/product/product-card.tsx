import React from 'react'
import { Card, CardFooter } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

const ProductCard = ({product}:{product: Product}) => {
  return (
    <Card key={product._id} className="relative group" >
        <Link href={`/product/${product.slug}`}>
            <div className="overflow-hidden">
            {product?.image ? (
            <Image
                src={getImageUrl(product?.image)}
                width={500}
                height={500}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-115"
                />
            
            ) : null}  
            </div>
            <CardFooter className="absolute bottom-0 left-0 right-0 bg-white mb-4 px-4">
            <div className="bg-accent flex items-center justify-between pl-4 pr-2 py-2 rounded-full w-full border shadow">
                <p className="text-xs font-semibold">{product.name}</p>
                
                <div className="bg-blue-600 rounded-full inline-block">
                <p className="font-semibold text-xs text-white px-2 py-1">
                    ${product.price.toFixed(2)}
                </p>
                </div>
            </div>
            </CardFooter>
        </Link>
    </Card>
  )
}

export default ProductCard
