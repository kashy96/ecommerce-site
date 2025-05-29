'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { formatDate, getImageUrl } from '@/lib/utils'
import Link from 'next/link';
import { Edit } from 'lucide-react';
// import PermanentDeletePost from '@/components/dashboard/PermanentDeletePost';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-left'
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className='capitalize font-medium'>{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'Image',
    header: () => {
      return (
        <Button
          variant='ghost'
        >
          Image
        </Button>
      )
    },
    cell: ({ row }) => {
      const imageUrl = row.original?.image || null; 
    
      return (
        <div>
        {imageUrl ? (
          <Image
            src={getImageUrl(imageUrl)}
            alt="thumbnail"
            width={40}
            height={40}
            className="object-contain rounded-lg"
          />
        ) : (
          <span>No Image</span>
        )}
      </div>
      );
    }
    
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div >{row.original.category.name}</div>
    }
  },
  // {
  //   accessorKey: 'content',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //       >
  //         Content
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const description: string | "" = row.getValue('content');
  //     const truncatedDescription = description ? (description.length > 100 ? description.substring(0, 100) + '...' : description) : "";
  //     return <div>{parse(truncatedDescription)}</div>;
  //   }
  // },
  {
    id: 'created at',
    accessorKey: 'created at',
    header: 'Created At',
    cell: ({ row }) => {
      return <div className='font-medium'>{formatDate(row.original.createdAt)}</div>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => { 
        
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
           
            {
             
                <>
                  <DropdownMenuSeparator />
                  <Link href={`/dashboard/post/edit/${row.original.slug}`} style={{cursor:"pointer"}}>
                    <div className="flex px-2 items-center">
                      <Edit 
                        width={16}
                        height={16}
                      />
                        <p className="ms-1">
                          Edit
                        </p>
                    </div>
                  </Link>
                </>
            }

            <DropdownMenuSeparator />

          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];






