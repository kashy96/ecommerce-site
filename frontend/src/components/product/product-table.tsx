'use client';

import React, { useState } from 'react'
import { ProductDataTable } from '../ui/product-data-table'
import { columns } from '@/app/dashboard/product/columns'
import { useRouter } from 'next/navigation';

const ProductTable = ({ data, totalRowCount, pageSize, pageIndex}:{data: Product[]; totalRowCount: number; pageSize: number; pageIndex: number;}) => {

  const router = useRouter();

  return (
    <ProductDataTable
          columns={columns}
          data={data}
          filterName={"title"}
          filter='title'
          totalRowCount={totalRowCount}
          pageSize={pageSize}
          onPageChange={(page: unknown) => { 
            // router.push(`/dashboard/posts?pageIndex=${page}&pageSize=${pageSize}&categories=${categoriesParam}&tags=${tagsParam}&status=${postStatus}`)
            // if (!categoriesParam && !tagsParam && !postStatus) {
              router.push(`/dashboard/product?pageIndex=${page}&pageSize=${pageSize}`);
            // } else {
            //   router.push(`/dashboard/posts?pageIndex=${page}&pageSize=${pageSize}&categories=${categoriesParam}&tags=${tagsParam}&status=${postStatus}`);
            // }
          }}
          onPageSizeChange={(size: unknown) => {
            // router.push(`/dashboard/posts?pageIndex=${pageIndex}&pageSize=${size}&categories=${categoriesParam}&tags=${tagsParam}&status=${postStatus}`)
            // if (!categoriesParam && !tagsParam && !postStatus) {
              router.push(`/dashboard/product?pageIndex=${pageIndex}&pageSize=${size}`);
            // } else {
            //   router.push(`/dashboard/posts?pageIndex=${pageIndex}&pageSize=${size}&categories=${categoriesParam}&tags=${tagsParam}&status=${postStatus}`);
            // }
          }}
        />
  )
}

export default ProductTable
