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

import { Star, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Feedback = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const feedbackData: Feedback[] = [
  { id: "1", name: "John Doe", rating: 5, comment: "Amazing service!", date: "2025-12-08" },
  { id: "2", name: "Priya Sharma", rating: 4, comment: "Very nice experience", date: "2025-12-07" },
  { id: "3", name: "Amit Patel", rating: 5, comment: "Perfect quality!", date: "2025-12-05" },
  { id: "4", name: "Sara Wilson", rating: 3, comment: "Okay service", date: "2025-12-03" },
];

/* WEEKLY FILTER */
const isWithin7Days = (date: string) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

export const feedbackColumns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 font-medium">
        {row.getValue("rating")}
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      </span>
    ),
  },
  {
    accessorKey: "comment",
    header: "Feedback",
    cell: ({ row }) => (
      <p className="line-clamp-2 text-sm text-gray-700">{row.getValue("comment")}</p>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("date")).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
];
export default function FeedbackTable() {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const weeklyFeedback = React.useMemo(
    () => feedbackData.filter((f) => isWithin7Days(f.date)),
    []
  );

  const table = useReactTable({
    data: weeklyFeedback,
    columns: feedbackColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="font-semibold">Latest Customer Feedback</h2>

        <Input
          placeholder="Search feedback..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
    </div>
  );
}
