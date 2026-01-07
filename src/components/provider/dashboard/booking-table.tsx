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
import TableSkeleton from "../tableSkeleton";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/customer/booking/StatusBadge";
import { BookingStatus, getAllowedTransitions } from "@/types/booking.types";

type Booking = {
  id: string;
  customer: string;
  service: string;
  serviceId: string;
  dateTime: string;
  amount: number;
  payment: string;
  status: string;
  partnerName?: string | null;
};

type TeamMember = {
  id: string;
  name: string;
};

function StatusDropdown({
  bookingId,
  status,
  payment,
  queryClient,
}: {
  bookingId: string;
  status: string;
  payment: string;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Get allowed transitions based on current status
  const allowedTransitions = React.useMemo(() => {
    try {
      const upperStatus = status.toUpperCase() as BookingStatus;
      return getAllowedTransitions(upperStatus);
    } catch {
      return [];
    }
  }, [status]);

  const isDisabled = (next: string) => {
    if (isUpdating) return true;
    if (next.toLowerCase() === status.toLowerCase()) return true;
    // Check if transition is allowed
    const nextUpper = next.toUpperCase() as BookingStatus;
    const currentUpper = status.toUpperCase() as BookingStatus;
    try {
      return !getAllowedTransitions(currentUpper).includes(nextUpper);
    } catch {
      return false;
    }
  };

  const updateStatus = async (next: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/provider/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next.toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.msg || "Status update failed");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      toast.success(`Booking status updated to ${next}`);
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isUpdating}>
          <BookingStatusBadge status={status} size="sm" />
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Change Status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allowedTransitions.length > 0 ? (
          allowedTransitions.map((s) => (
            <DropdownMenuItem
              key={s}
              disabled={isDisabled(s)}
              className="capitalize"
              onClick={() => updateStatus(s)}>
              <div className="flex items-center gap-2">
                <BookingStatusBadge status={s} size="sm" />
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-xs text-gray-500">
            No valid transitions
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "service", header: "Service" },
  {
    accessorKey: "dateTime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date and Time <ArrowUpDown className="w-4 h-4 ml-2" />
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
      const v = row.getValue("payment") as string;
      return <PaymentStatusBadge status={v} size="sm" />;
    },
  },
  {
    header: "Status",
    cell: ({ row, table }) => {
      const queryClient = table.options.meta?.queryClient;
      if (!queryClient) return null;

      return (
        <StatusDropdown
          bookingId={row.original.id}
          status={row.original.status}
          payment={row.original.payment}
          queryClient={queryClient}
        />
      );
    },
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
          <DropdownMenuItem asChild>
            <Link href={`/provider/dashboard/bookings/${row.original.id}`}>
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

export function BookingTable({ NumberOfRows = 5 }: { NumberOfRows?: number }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/provider/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    retry: 2,
  });

  const bookings: Booking[] = React.useMemo(() => {
    if (!data?.bookings && !Array.isArray(data)) return [];

    const list = Array.isArray(data) ? data : [data.bookings];

    return list.map((b: any) => ({
      id: b.id,
      customer: b.user?.name ?? "Unknown Customer",
      service: b.service?.name ?? "Unknown Service",
      serviceId: b.service?.id,
      dateTime: new Date(b.date || b.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      amount: b.totalAmount || 0,
      payment: b.paymentStatus || "PENDING",
      status: b.bookingStatus || "PENDING",
      partnerName: b.partner?.name ?? null,
    }));
  }, [data]);

  const table = useReactTable({
    data: bookings,
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

  if (isLoading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-sm font-medium mb-2">
          Failed to load bookings
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          Booking List{" "}
          {bookings.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({bookings.length} total)
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search by customer, service, or status..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh bookings">
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((g) => (
              <TableRow key={g.id}>
                {g.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-gray-500 font-medium">
                      No bookings found
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetch()}
                      className="text-xs">
                      Refresh to check for new bookings
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {table.getRowModel().rows.length > NumberOfRows && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {table.getState().pagination.pageIndex * NumberOfRows + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * NumberOfRows,
              table.getRowModel().rows.length
            )}{" "}
            of {table.getRowModel().rows.length} bookings
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
