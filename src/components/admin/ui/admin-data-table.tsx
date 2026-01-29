"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ColumnDef {
  header: string | ReactNode;
  className?: string; // for column width or alignment
}

interface AdminDataTableProps<T> {
  title?: ReactNode;
  columns: ColumnDef[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  isLoading?: boolean;
  skeleton?: ReactNode;
  emptyMessage?: string;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  actionButton?: ReactNode; // Optional button in header
}

export function AdminDataTable<T>({
  title,
  columns,
  data,
  renderRow,
  isLoading,
  skeleton,
  emptyMessage = "No data found.",
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  actionButton,
}: AdminDataTableProps<T>) {
  return (
    <Card>
      {(title || actionButton) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {title && <CardTitle>{title}</CardTitle>}
          {actionButton && <div>{actionButton}</div>}
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && skeleton ? (
              skeleton
            ) : isLoading ? (
              Array.from({ length: 8 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => renderRow(item))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Simple pagination logic mimicking current impl */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => {
                    // Show first, last, current, and surrounding
                    if (
                      totalPages > 10 &&
                      Math.abs(currentPage - p) > 2 &&
                      p !== 1 &&
                      p !== totalPages
                    ) {
                      if (Math.abs(currentPage - p) === 3)
                        return (
                          <PaginationItem key={p}>
                            <span className="px-4">...</span>
                          </PaginationItem>
                        );
                      return null;
                    }

                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={currentPage === p}
                          onClick={() => onPageChange(p)}
                          className="cursor-pointer">
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
