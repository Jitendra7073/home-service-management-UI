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

type Booking = {
  id: string;
  customer: string;
  service: string;
  serviceId: string;
  dateTime: string;
  amount: number;
  payment: "paid" | "pending" | "failed";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  partnerId: string | null;
  partnerName: string | null;
};

type TeamMember = {
  id: string;
  name: string;
};

function StatusDropdown({
  bookingId,
  status,
  payment,
  partnerId,
  queryClient,
}: {
  bookingId: string;
  status: Booking["status"];
  payment: Booking["payment"];
  partnerId: string | null;
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
    if (next === "completed" && !partnerId) return true;
    if (payment === "paid" && next === "pending") return true;
    if (next === status) return true;
    return false;
  };

  const updateStatus = async (next: Booking["status"]) => {
    if (isDisabled(next)) {
      if (next === "completed" && !partnerId) {
        toast.error("Assign a partner before completing the booking");
      }
      return;
    }

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

function PartnerDropdown({
  bookingId,
  serviceId,
  status,
  queryClient,
}: {
  bookingId: string;
  serviceId: string;
  status: Booking["status"];
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const disabled = status === "completed" || status === "cancelled";

  const { data, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["service-team", serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/teams/${serviceId}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!serviceId && !disabled,
  });

  const assignPartner = async (partnerId: string) => {
    const res = await fetch(`/api/provider/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result?.msg || "Assignment failed");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    toast.success("Partner assigned");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled}>
          Assign Partner
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-56">
        {isLoading && (
          <DropdownMenuItem disabled>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Loading
          </DropdownMenuItem>
        )}

        {!isLoading &&
          data?.members.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => assignPartner(m.id)}>
              {m.name}
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
    header: "Partner",
    cell: ({ row, table }) => (
      <div className="flex flex-col gap-1">
        <span className="text-sm">
          {row.original.partnerName ?? "Not Assigned"}
        </span>
        <PartnerDropdown
          bookingId={row.original.id}
          serviceId={row.original.serviceId}
          status={row.original.status}
          queryClient={table.options.meta?.queryClient}
        />
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row, table }) => (
      <StatusDropdown
        bookingId={row.original.id}
        status={row.original.status}
        payment={row.original.payment}
        partnerId={row.original.partnerId}
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
      partnerId: b.partnerId ?? null,
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
          <Button variant="ghost" onClick={() => refetch()} disabled={isFetching}>
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
                    {flexRender(
                      h.column.columnDef.header,
                      h.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  Loading bookings
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
                <TableCell colSpan={columns.length} className="text-center py-10">
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
