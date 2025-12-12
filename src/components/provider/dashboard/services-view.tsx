"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";


export type Service = {
  id: string;
  name: string;
  price: number;
  bookings: number;
  rating: number;
  status: "active" | "inactive";
};

const serviceData: Service[] = [
  { id: "1", name: "Haircut", price: 350, bookings: 82, rating: 4.8, status: "active" },
  { id: "2", name: "Facial", price: 999, bookings: 56, rating: 4.6, status: "active" },
  { id: "3", name: "Massage Therapy", price: 1500, bookings: 33, rating: 4.9, status: "active" },
  { id: "4", name: "Pedicure", price: 450, bookings: 41, rating: 4.2, status: "inactive" },
];


export const serviceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Service",
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>₹{row.getValue("price")}</span>,
  },

  {
    accessorKey: "bookings",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Bookings
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <span>{row.getValue("rating")}</span>,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge variant={status === "active" ? "default" : "destructive"} className="capitalize ">
          {status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>Edit Service</DropdownMenuItem>
            <DropdownMenuItem>Disable Service</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
              Copy Service ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];



export default function ServicesTable() {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: serviceData,
    columns: serviceColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="font-semibold">All Services</h2>

      {/* GLOBAL SEARCH */}
      <Input
        placeholder="Search services..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
      </div>

      {/* TABLE */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={serviceColumns.length} className="text-center py-6">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
