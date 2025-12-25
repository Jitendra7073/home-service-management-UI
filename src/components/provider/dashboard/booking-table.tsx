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

type Booking = {
  id: string;
  customer: string;
  service: string;
  serviceId: string;
  dateTime: string;
  amount: number;
  payment: "paid" | "pending" | "failed";
  status: "pending" | "confirmed" | "completed" | "cancelled";
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
  status: Booking["status"];
  payment: Booking["payment"];
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const statuses: Booking["status"][] = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  const isDisabled = (next: Booking["status"]) => {
    if (status === "completed" || status === "cancelled") return true;
    if (next === status) return true;
    return false;
  };

  const updateStatus = async (next: Booking["status"]) => {
    const res = await fetch(`/api/provider/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.msg || "Status update failed");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    toast.success("Booking updated");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="capitalize">
          {status}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {statuses.map((s) => (
          <DropdownMenuItem
            key={s}
            disabled={isDisabled(s)}
            className="capitalize"
            onClick={() => updateStatus(s)}>
            {s}
          </DropdownMenuItem>
        ))}
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
      const map: Record<string, string> = {
        paid: "text-green-600",
        pending: "text-yellow-600",
        failed: "text-red-600",
      };
      return <span className={`capitalize ${map[v]}`}>{v}</span>;
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

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/provider/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const bookings: Booking[] = React.useMemo(() => {
    if (!data?.bookings && !Array.isArray(data)) return [];

    const list = Array.isArray(data) ? data : [data.bookings];

    return list.map((b: any) => ({
      id: b.id,
      customer: b.user?.name ?? "Unknown",
      service: b.service?.name ?? "Unknown",
      serviceId: b.service?.id,
      dateTime: new Date(b.createdAt).toLocaleString("en-IN"),
      amount: b.totalAmount,
      payment: b.paymentStatus.toLowerCase(),
      status: b.bookingStatus.toLowerCase(),
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
    return <TableSkeleton rows={10} columns={5} />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Booking List</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search bookings"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            className="max-w-sm"
          />
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isFetching}>
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
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
