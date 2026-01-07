"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal, RefreshCw } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import TableSkeleton from "../tableSkeleton";

export type Service = {
  id: string;
  name: string;
  price: number;
  bookings: number;
  rating: number;
  status: "active" | "inactive";
};

export default function ServicesTable({
  NumberOfRows = 5,
}: {
  NumberOfRows?: number;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/provider/service", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });


  const toggleServiceStatus = async (
    serviceId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const res = await fetch(`/api/provider/service`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: currentStatus === "active" ? false : true,
          serviceId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Failed to update service status");
        return;
      }

      toast.success("Service status updated");

      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const serviceData: Service[] = React.useMemo(() => {
    if (!data) return [];

    const bookingMap: Record<string, number> = {};
    data.bookingCounts?.forEach((item: any) => {
      bookingMap[item.serviceId] = item._count.serviceId;
    });

    return Object.values(data)
      .filter((item: any) => typeof item === "object" && item.id)
      .map((service: any) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        bookings: bookingMap[service.id] || 0,
        rating: service.averageRating || 0,
        status: service.isActive ? "active" : "inactive",
      }));
  }, [data]);


  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Service",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>₹{row.getValue("price")}</span>,
    },
    {
      accessorKey: "bookings",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bookings <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => Number(row.getValue("rating")).toFixed(1),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "active" ? "default" : "destructive"}
            className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem>
                <Link href={`/provider/dashboard/services/${item.id}`}>
                  View Service
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => toggleServiceStatus(item.id, item.status)}>
                {item.status === "active" ? "Disable" : "Enable"} Service
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}>
                Copy Service ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: serviceData,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: NumberOfRows,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  
  if(isLoading) {
    return <TableSkeleton rows={5} columns={5}/>
  }

  return (
    <div className="w-full space-y-4 mb-10">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">All Services</h3>

       <div className="flex gap-2">
         <Input
          placeholder="Search services..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            table.setPageIndex(0);
          }}
          className="w-full md:max-w-sm"
        />
        {!isLoading && (
          <Button
          variant="outline"
            size="icon"
            className="bg-transparent text-black hover:bg-gray-100"
            onClick={() => refetch()}
            disabled={isFetching}>
            <RefreshCw
              className={`h-4 w-4 transition-transform ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </Button>
        )}
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
                  Loading services...
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
                  className="text-center py-6">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
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
