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

import { CheckCheck, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TableSkeleton from "../tableSkeleton";

/* -------------------- TYPES -------------------- */

export type Feedback = {
  id: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved: boolean;
};

/* -------------------- HELPERS -------------------- */

const isWithin7Days = (date: string) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

const truncate = (text: string, len = 20) =>
  text.length > len ? text.slice(0, len) + "…" : text;

/* -------------------- COMPONENT -------------------- */

export default function FeedbackTable() {
  const queryClient = useQueryClient();

  const [globalFilter, setGlobalFilter] = React.useState("");
  // const [statusFilter, setStatusFilter] = React.useState<
  //   "all" | "approved" | "pending"
  // >("all");

  const { data, isLoading, isPending } = useQuery({
    queryKey: ["customer-feedback"],
    queryFn: async () => {
      const res = await fetch("/api/provider/feedback");
      return res.json();
    },
  });

  const weeklyFeedback: Feedback[] = React.useMemo(
    () =>
      data?.feedbacks?.filter((f: Feedback) => isWithin7Days(f.createdAt)) ||
      [],
    [data?.feedbacks]
  );

  // const approvedCount = weeklyFeedback.filter((f) => f.approved).length;
  // const pendingCount = weeklyFeedback.filter((f) => !f.approved).length;

  const filteredByStatus = React.useMemo(() => {
    // if (statusFilter === "approved")
    //   return weeklyFeedback.filter((f) => f.approved);
    // if (statusFilter === "pending")
    //   return weeklyFeedback.filter((f) => !f.approved);
    return weeklyFeedback;
  }, [weeklyFeedback]);

  const sortedFeedback = React.useMemo(() => {
    return [...filteredByStatus].sort(
      (a, b) => Number(a.approved) - Number(b.approved)
    );
  }, [filteredByStatus]);

  // const approveMutation = useMutation({
  //   mutationFn: async (feedbackId: string) => {
  //     const res = await fetch("/api/provider/feedback", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ feedbackId }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message || "Approval failed");
  //     return data;
  //   },
  //   onSuccess: () => {
  //     toast.success("Feedback approved successfully");
  //     queryClient.invalidateQueries({ queryKey: ["customer-feedback"] });
  //   },
  //   onError: (e: any) => toast.error(e.message),
  // });

  /* -------------------- COLUMNS -------------------- */

  const columns: ColumnDef<Feedback>[] = [
    { accessorKey: "username", header: "Customer" },

    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          {row.getValue("rating")}
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </span>
      ),
    },

    {
      accessorKey: "comment",
      header: "Feedback",
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="cursor-pointer text-sm">
                {truncate(feedback.comment)}
              </p>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 space-y-3">
              <p className="text-sm">
                <strong>Comment:</strong> {feedback.comment}
              </p>
              
            </HoverCardContent>
          </HoverCard>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString("en-IN"),
    },
  ];

  /* -------------------- TABLE -------------------- */

  const table = useReactTable({
    data: sortedFeedback,
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

  if (isLoading || isPending) {
    return <TableSkeleton rows={5} columns={5} />;
  }
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="font-semibold">Latest Customer Feedback</h2>

        {/* <div className="flex gap-2 items-center">
          <Badge className="bg-yellow-100 text-yellow-700">
            Pending: {pendingCount}
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            Approved: {approvedCount}
          </Badge>
        </div> */}
        <Input
          placeholder="Search feedback..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Filters */}
      {/* <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search feedback..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as "all" | "approved" | "pending")
          }>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Table */}
      <div className="border rounded-md">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
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
  );
}
