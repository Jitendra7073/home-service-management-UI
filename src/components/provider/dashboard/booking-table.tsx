"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader,
  MoreHorizontal,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

/* ================= Types ================= */

type Booking = {
  id: string;
  customer: string;
  service: string;
  dateTime: string;
  amount: number;
  payment: "paid" | "pending" | "failed";
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

/* ================= Status Dropdown ================= */

function StatusDropdown({
  bookingId,
  currentStatus,
  paymentStatus,
  queryClient,
}: {
  bookingId: string;
  currentStatus: Booking["status"];
  paymentStatus: Booking["payment"];
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const statuses: Booking["status"][] = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  // Business rules for disabling options
  const isDisabled = (status: Booking["status"]) => {
    if (currentStatus === "completed") return true;
    if (paymentStatus === "paid" && status === "pending") return true;
    if (status === currentStatus) return true;
    return false;
  };

  // Update booking status
  const updateStatus = async (status: Booking["status"]) => {
    if (isDisabled(status)) return;

    try {
      const res = await fetch(`/api/provider/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Status update failed");
        return;
      }

      toast.success("Booking status updated");

      // Refetch booking list without reloading the page
      queryClient.invalidateQueries({
        queryKey: ["provider-bookings"],
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentStatus === "completed"}
          className="capitalize">
          {currentStatus}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status}
            disabled={isDisabled(status)}
            className="capitalize"
            onClick={() => updateStatus(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ================= Columns ================= */

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "service", header: "Service" },
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date & Time <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ₹{Number(row.getValue("amount")).toLocaleString("en-IN")}
      </div>
    ),
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const value = row.getValue("payment") as string;
      const colors: Record<string, string> = {
        paid: "text-green-600",
        pending: "text-yellow-600",
        failed: "text-red-600",
      };
      return <span className={`capitalize ${colors[value]}`}>{value}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, table }) => (
      <StatusDropdown
        bookingId={row.original.id}
        currentStatus={row.original.status}
        paymentStatus={row.original.payment}
        queryClient={table.options.meta?.queryClient}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href={`/provider/dashboard/bookings/${row.original.id}`}
              className="w-full block">
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}>
            Copy Booking ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

/* ================= Component ================= */

export function BookingTable({ NumberOfRows = 5 }: { NumberOfRows?: number }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const queryClient = useQueryClient();

  // Fetch bookings
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/provider/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Transform API response for table
  const bookingData: Booking[] = React.useMemo(() => {
    if (!data) return [];
    return data.map((b: any) => ({
      id: b.id,
      customer: b.user?.name ?? "Unknown",
      service: b.service?.name ?? "Unknown",
      dateTime: new Date(b.createdAt).toLocaleString("en-IN"),
      amount: b.totalAmount,
      payment: b.paymentStatus.toLowerCase(),
      status: b.bookingStatus.toLowerCase(),
    }));
  }, [data]);

  const table = useReactTable({
    data: bookingData,
    columns,
    meta: { queryClient },
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex: 0, pageSize: NumberOfRows },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Booking List</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search bookings..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            className="max-w-sm"
          />
          {!isLoading && <Button
            className="bg-transparent text-black hover:bg-gray-100"
            onClick={() => refetch()}
            disabled={isFetching}>
            <RefreshCw
              className={`h-4 w-4 transition-transform ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </Button>}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
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

      <div className="flex justify-between items-center py-4">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
        <div className="flex gap-2">
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
    </div>
  );
}
