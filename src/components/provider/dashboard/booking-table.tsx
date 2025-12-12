"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export const bookings: Booking[] = [
  {
    id: "BKG001",
    customer: "John Doe",
    service: "Haircut",
    dateTime: "2025-02-10 10:30 AM",
    amount: 350,
    payment: "paid",
    status: "completed",
  },
  {
    id: "BKG002",
    customer: "Priya Sharma",
    service: "Facial",
    dateTime: "2025-02-10 11:00 AM",
    amount: 999,
    payment: "pending",
    status: "pending",
  },
  {
    id: "BKG003",
    customer: "Amit Patel",
    service: "Massage Therapy",
    dateTime: "2025-02-09 04:00 PM",
    amount: 1500,
    payment: "paid",
    status: "confirmed",
  },
  {
    id: "BKG004",
    customer: "Sara Wilson",
    service: "Pedicure",
    dateTime: "2025-02-08 02:30 PM",
    amount: 499,
    payment: "failed",
    status: "cancelled",
  },
  {
    id: "BKG005",
    customer: "Rahul Singh",
    service: "Hair Color",
    dateTime: "2025-02-07 03:00 PM",
    amount: 1900,
    payment: "paid",
    status: "completed",
  },
];

export type Booking = {
  id: string;
  customer: string;
  service: string;
  dateTime: string;
  amount: number;
  payment: "paid" | "pending" | "failed";
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

const StatusDropdown = ({ value, onChange }: any) => {
  const statuses = ["pending", "confirmed", "completed", "cancelled"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="capitalize outline-none font-normal ">
          {value} <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status}
            className="capitalize"
            onClick={() => onChange(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <Link
          href={"/provider/dashboard"}
          className="hover:text-blue-700 font-medium hover:underline">
          {row.getValue("customer")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => <div>{row.getValue("service")}</div>,
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date & Time <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("dateTime")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="text-right font-medium">
          ₹{Number(amount).toLocaleString("en-IN")}
        </div>
      );
    },
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const val = row.getValue("payment") as string;
      const colors: any = {
        paid: "text-green-600",
        pending: "text-yellow-600",
        failed: "text-red-600",
      };

      return <span className={`capitalize ${colors[val]}`}>{val}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, table }) => {
      const current = row.getValue("status");
      return (
        <StatusDropdown
          value={current}
          onChange={(newStatus: string) => {
            row.original.status = newStatus;
            table.options.meta?.updateData(row.index, "status", newStatus);
          }}
        />
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}>
            Copy Booking ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Customer</DropdownMenuItem>
          <DropdownMenuItem>View Booking Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function BookingTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        bookings[rowIndex][columnId] = value;
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="font-semibold">Booking List</h2>
        <Input
          placeholder="Search bookings..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                  className="text-center py-10">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 py-4">
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}>
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
