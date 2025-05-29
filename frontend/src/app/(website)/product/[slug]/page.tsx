import ProductDetail from '@/components/product/product-detail';
import { productDetail } from '@/lib';
import React from 'react';

interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params

  console.log('slug from params is', slug);

  const productDetailResponse: ProductDetailResponse = await productDetail(slug);
  const { product, relatedProducts } = productDetailResponse;

  return (
    <div>
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </div>
  );
};

export default Page;
