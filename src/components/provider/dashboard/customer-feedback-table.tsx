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

import { ArrowUpDown, Star, MessageSquare, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "../tableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Feedback = {
  id: string;
  username: string;
  servicename: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "username",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("username") as string;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  { accessorKey: "servicename", header: "Service" },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Rating <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{rating}</span>
          <span className="text-gray-500 text-sm">/5</span>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Review",
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;
      return (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 line-clamp-2">{comment}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>;
    },
  },
];

export default function FeedbackTable({ NumberOfRows = 5 }: { NumberOfRows?: number }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["provider-feedback"],
    queryFn: async () => {
      const res = await fetch("/api/provider/feedback", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
    retry: 2,
  });

  const feedbacks: Feedback[] = React.useMemo(() => {
    if (!data?.feedbacks) return [];

    return data.feedbacks.map((f: any) => ({
      id: f.id,
      username: f.username || "Anonymous",
      servicename: f.servicename || "Unknown Service",
      rating: f.rating || 0,
      comment: f.comment || "",
      createdAt: f.createdAt || new Date().toISOString(),
    }));
  }, [data]);

  const table = useReactTable({
    data: feedbacks,
    columns,
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

  const avgRating = React.useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <TableSkeleton rows={10} columns={5} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Feedback
          </h3>
          {feedbacks.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Average rating:{" "}
              <span className="font-semibold text-yellow-600">{avgRating}</span>{" "}
              ({feedbacks.length} reviews)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search reviews..."
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
            title="Refresh feedback">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-12 w-12 text-gray-300" />
                    <div className="text-gray-500 font-medium">No feedback yet</div>
                    <p className="text-sm text-gray-400">
                      Customer reviews will appear here once you receive feedback
                    </p>
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
            of {table.getRowModel().rows.length} feedbacks
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
