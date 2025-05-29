'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
  PaginationState
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'

// Custom filter function for nested properties
const nestedStringFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = columnId.split('.').reduce((acc, part) => acc && acc[part], row.original);
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // filterName?: string
  // filter?: string
  totalRowCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function ProductDataTable<TData, TValue>({
  columns,
  data,
  // filterName = 'name',
  // filter = 'name',
  totalRowCount,
  pageSize,
  onPageChange,
  onPageSizeChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    filterFns: {
      nestedStringFilter 
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    rowCount: totalRowCount,
    manualPagination: true,
  })

  return (
    <>
      {/* Filters */}
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center py-4'>
          {/* <Input
            placeholder={`Search by ${filter}...`}
            value={(table.getColumn(filterName)?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn(filterName)?.setFilterValue(event.target.value)
            }
            className='max-w-lg'
          /> */}
        </div>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            const newPageIndex = table.getState().pagination.pageIndex - 1
            setPagination(prev => ({ ...prev, pageIndex: newPageIndex }))
            onPageChange(newPageIndex)
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            const newPageIndex = table.getState().pagination.pageIndex + 1
            setPagination(prev => ({ ...prev, pageIndex: newPageIndex }))
            onPageChange(newPageIndex)
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {Math.ceil(totalRowCount / table.getState().pagination.pageSize)}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            const newPageSize = Number(e.target.value)
            onPageSizeChange(newPageSize)
            setPagination(prev => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }))
          }}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
