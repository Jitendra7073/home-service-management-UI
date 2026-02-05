"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

interface StaffTableProps {
  NumberOfRows?: number;
}

export default function StaffTable({ NumberOfRows = 10 }: StaffTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [search, setSearch] = useState("");

  // Fetch staff data
  const { data, isLoading } = useQuery({
    queryKey: ["staff", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await fetch(`/api/provider/staff?${params.toString()}`, {
        method: "GET",
      });
      return res.json();
    },
  });

  const staffProfiles = data?.staffProfiles || [];

  const columns: ColumnDef<(typeof staffProfiles)[number]>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-3">
            {staff.photo ? (
              <img
                src={staff.photo}
                alt={staff.user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {staff.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{staff.user.name}</p>
              <p className="text-sm text-gray-500">{staff.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => {
        const specializations = row.original.specialization;
        return (
          <div className="flex flex-wrap gap-1">
            {specializations.slice(0, 2).map((spec: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {spec}
              </span>
            ))}
            {specializations.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{specializations.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "employmentType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.employmentType;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              type === "BUSINESS_BASED"
                ? "bg-purple-100 text-purple-700"
                : "bg-orange-100 text-orange-700"
            }`}>
            {type === "BUSINESS_BASED" ? "Business Staff" : "Freelancer"}
          </span>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => {
        const experience = row.original.experience;
        return (
          <span className="text-gray-700">
            {experience} {experience === 1 ? "year" : "years"}
          </span>
        );
      },
    },
    {
      accessorKey: "availability",
      header: "Availability",
      cell: ({ row }) => {
        const staff = row.original;
        const availability = staff.availability || "AVAILABLE";

        if (availability === "BUSY") {
          return (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
                Busy
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
              Available
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "_count.bookings",
      header: "Bookings",
      cell: ({ row }) => {
        const count = row.original._count?.bookings || 0;
        return <span className="text-gray-700">{count}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/provider/dashboard/staff/${staff.id}`)
                }>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteStaff(staff.id)}
                className="text-red-600">
                Delete Staff
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: staffProfiles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const res = await fetch(`/api/provider/staff/${staffId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert("Staff deleted successfully");
        window.location.reload();
      } else {
        alert(data.msg || "Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  {isLoading ? "Loading..." : "No staff members found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
}
