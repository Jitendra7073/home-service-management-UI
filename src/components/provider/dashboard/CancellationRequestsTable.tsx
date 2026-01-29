"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { IndianRupee, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { TableCell, TableRow } from "@/components/ui/table";
import { AdminDataTable } from "@/components/admin/ui/admin-data-table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/* -------------------- TYPES -------------------- */

export type Cancellation = {
  id: string;
  reason: string;
  reasonType: string;
  requestedAt: string;
  refundStatus: "PENDING" | "REFUNDED" | "FAILED";
  booking: {
    id: string;
    date: string;
    service: { name: string };
    user: { name: string };
  };
};

/* -------------------- HELPERS -------------------- */

const truncate = (text: string, len = 30) =>
  text.length > len ? text.slice(0, len) + "…" : text;

/* -------------------- COMPONENT -------------------- */

export default function CancellationRequestsTable() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = React.useState("");

  /* -------------------- FETCH DATA -------------------- */

  const { data, isLoading, isPending } = useQuery({
    queryKey: ["provider-cancellations"],
    queryFn: async () => {
      const res = await fetch("/api/provider/cancellations");
      if (!res.ok) throw new Error("Failed to fetch cancellations");
      return res.json();
    },
  });

  const cancellations: Cancellation[] = data?.cancellations || [];

  /* -------------------- REFUND MUTATION -------------------- */

  const refundMutation = useMutation({
    mutationFn: async (cancellationId: string) => {
      const res = await fetch("/api/provider/cancellations/refund", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Refund failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Cancellation approved & refund initiated");
      queryClient.invalidateQueries({
        queryKey: ["provider-cancellations"],
      });
    },
    onError: (e: any) => toast.error(e.message),
  });

  /* -------------------- COLUMNS -------------------- */

  const columns: ColumnDef<Cancellation>[] = [
    {
      header: "Service",
      accessorFn: (row) => row.booking.service.name,
    },
    {
      header: "Customer",
      accessorFn: (row) => row.booking.user.name,
    },
    {
      header: "Booking Date",
      accessorFn: (row) => row.booking.date,
    },
    {
      header: "Reason",
      cell: ({ row }) => {
        const { reason } = row.original;
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="cursor-pointer text-sm text-gray-700">
                {truncate(reason)}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <p className="text-sm">
                <strong>Reason:</strong> {reason}
              </p>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      header: "Requested On",
      accessorFn: (row) =>
        new Date(row.requestedAt).toLocaleDateString("en-IN"),
    },
    {
      header: "Refund Status",
      cell: ({ row }) => {
        const status = row.original.refundStatus;
        return (
          <Badge
            variant="outline"
            className={
              status === "REFUNDED"
                ? "border-green-500 text-green-700"
                : status === "FAILED"
                ? "border-red-500 text-red-700"
                : "border-yellow-500 text-yellow-700"
            }>
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const cancellation = row.original;
        const isDisabled = cancellation.refundStatus !== "PENDING";

        return (
          <Button
            size="sm"
            disabled={isDisabled || refundMutation.isPending}
            onClick={() => refundMutation.mutate(cancellation.id)}
            className="flex items-center gap-2">
            {cancellation.refundStatus === "REFUNDED" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Refunded
              </>
            ) : (
              <>
                <IndianRupee className="w-4 h-4" />
                Approve & Refund
              </>
            )}
          </Button>
        );
      },
    },
  ];

  /* -------------------- TABLE -------------------- */

  const table = useReactTable({
    data: cancellations,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  /* -------------------- RENDER -------------------- */

  /* -------------------- RENDER -------------------- */
  const adminColumns = table.getHeaderGroups()[0].headers.map((header) => ({
    header: flexRender(header.column.columnDef.header, header.getContext()),
  }));

  return (
    <AdminDataTable
      title="Cancellation Requests"
      columns={adminColumns}
      data={table.getRowModel().rows}
      isLoading={isLoading || isPending}
      actionButton={
        <Input
          placeholder="Search cancellation..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
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
      emptyMessage="No cancellation requests found."
    />
  );
}
