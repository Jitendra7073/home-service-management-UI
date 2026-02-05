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
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminDataTable } from "@/components/admin/ui/admin-data-table";

import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/customer/booking/StatusBadge";
import { BookingStatus, getAllowedTransitions } from "@/types/booking.types";
import { AssignStaffModal } from "./assign-staff-modal";

// Extend meta type for our table
declare module "@tanstack/react-table" {
  interface TableMeta<TData = unknown> {
    queryClient?: QueryClient;
    openAssignModal?: (id: string) => void;
  }
}

type Booking = {
  id: string;
  customer: string;
  service: string;
  serviceId: string;
  dateTime: string;
  amount: number;
  receivedAmount: number;
  payment: string;
  status: string;
  partnerName?: string | null;
  assignedStaffName?: string | null;
  trackingStatus?: string;
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
  queryClient: QueryClient;
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
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ₹{Number(row.getValue("amount")).toLocaleString("en-IN")}
      </div>
    ),
  },
  {
    accessorKey: "receivedAmount",
    header: () => (
      <div className="text-right text-emerald-600">Net Earnings</div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium text-emerald-600">
        ₹{Number(row.getValue("receivedAmount")).toLocaleString("en-IN")}
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
    header: "Assigned To",
    cell: ({ row }) => {
      const assigned = row.original.assignedStaffName;
      return assigned ? (
        <span className="text-sm font-medium text-gray-700">{assigned}</span>
      ) : (
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
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
          <DropdownMenuItem
            onClick={() =>
              table.options.meta?.openAssignModal?.(row.original.id)
            }
            disabled={
              !!row.original.assignedStaffName &&
              row.original.trackingStatus !== "NOT_STARTED"
            }>
            Assign Staff
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
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [selectedBookingId, setSelectedBookingId] = React.useState<string>("");
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

    return list.map((b: any) => {
      let earnings = b.totalAmount || 0;
      if (b.providerEarnings !== null && b.providerEarnings !== undefined) {
        if (b.providerEarnings > 0 || b.platformFee > 0) {
          earnings = b.providerEarnings;
        }
      }

      const assignedStaff = b.StaffAssignBooking?.[0]?.assignedStaff;

      return {
        id: b.id,
        customer: b.user?.name ?? "Unknown Customer",
        service: b.service?.name ?? "Unknown Service",
        serviceId: b.service?.id,
        dateTime: (() => {
          const dateObj = new Date(b.date || b.createdAt);
          const dateStr = dateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          if (b.slot?.time) {
            return `${dateStr}, ${b.slot.time}`;
          }
          return dateStr;
        })(),
        amount: b.totalAmount || 0,
        receivedAmount: b.providerEarnings || 0,
        payment: b.paymentStatus || "PENDING",
        status: b.bookingStatus || "PENDING",
        partnerName: b.partner?.name ?? null,
        assignedStaffName: assignedStaff ? assignedStaff.name : null,
        trackingStatus: b.trackingStatus || "NOT_STARTED",
      };
    });
  }, [data]);

  const openAssignModal = (id: string) => {
    setSelectedBookingId(id);
    setAssignModalOpen(true);
  };

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex: 0, pageSize: NumberOfRows },
    },
    meta: { queryClient, openAssignModal },
  });

  const adminColumns = table.getHeaderGroups()[0].headers.map((header) => ({
    header: flexRender(header.column.columnDef.header, header.getContext()),
  }));

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
      <AdminDataTable
        title={`Booking List ${
          bookings.length > 0 ? `(${bookings.length} total)` : ""
        }`}
        columns={adminColumns}
        data={table.getRowModel().rows}
        isLoading={isLoading}
        actionButton={
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
        }
        renderRow={(row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
        onPageChange={(p) => table.setPageIndex(p - 1)}
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        emptyMessage="New Booking will appear here"
      />

      {selectedBookingId && (
        <AssignStaffModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          bookingId={selectedBookingId}
        />
      )}
    </div>
  );
}
