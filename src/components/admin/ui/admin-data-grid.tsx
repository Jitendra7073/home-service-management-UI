"use client";

import { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/admin/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDataGridProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  isLoading?: boolean;
  skeletonItem?: ReactNode;
  itemsPerPage?: number;
  emptyState?: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  gridClassName?: string;
}

export function AdminDataGrid<T>({
  data,
  renderItem,
  isLoading,
  skeletonItem,
  itemsPerPage = 6,
  emptyState,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  gridClassName,
}: AdminDataGridProps<T>) {
  // Default skeleton if none provided
  const DefaultSkeleton = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[200px] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          `grid gap-4 md:grid-cols-2 lg:grid-cols-3`,
          gridClassName,
        )}>
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <div key={i}>{skeletonItem || <DefaultSkeleton />}</div>
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.onAction}
      />
    );
  }

  return (
    <>
      <div
        className={cn("grid gap-4 grid-cols-1 md:grid-cols-2", gridClassName)}>
        {data.map((item, index) => renderItem(item))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-8">
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
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
              })}

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
    </>
  );
}
