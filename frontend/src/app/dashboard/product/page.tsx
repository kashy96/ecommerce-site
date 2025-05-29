import React from 'react';
import { CustomSession, authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDrawer } from '@/components/product/add-product';
import ProductTable from '@/components/product/product-table';
import { fetchProducts } from '@/lib';

interface ProductResponse {
  products: Product[];
  totalProducts: number;
}

export default async function Post({
  searchParams,
}: {
  searchParams: { pageIndex: number; pageSize: number; };
}) {
  // Await searchParams before using
  const params = await searchParams;

  const session: CustomSession | null = await getServerSession(authOptions);
  let products: Product[] = [];
  let totalRowCount = 0;

  // Now safely access pageIndex and pageSize
  const pageIndex = params.pageIndex || 0;
  const pageSize = params.pageSize || 10;

  if (session && session.user) {
    const productResponse: ProductResponse = await fetchProducts(session.user, pageIndex, pageSize);
    products = productResponse.products;
    totalRowCount = productResponse.totalProducts;
  }

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Products</p>
            <div className="flex items-center gap-2">
              <AddProductDrawer />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductTable data={products} totalRowCount={totalRowCount} pageSize={pageSize} pageIndex={pageIndex} />
      </CardContent>
    </Card>
  );
}
