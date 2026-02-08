import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto md:px-6 py-6 md:py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border bg-card rounded-sm p-2 shadow-sm">
          <div className="px-6 py-4 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center justify-end gap-2 px-6 md:px-4 pb-4 md:pb-0">
            <Skeleton className="h-9 w-32 rounded-sm" />{" "}
            {/* Visibility Toggle */}
            <Skeleton className="h-9 w-9 rounded-sm" /> {/* Refresh button */}
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-sm" />
          <Skeleton className="h-32 rounded-sm" />
          <Skeleton className="h-32 rounded-sm" />
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full rounded-sm lg:col-span-2" />
          <Skeleton className="h-96 w-full rounded-sm lg:col-span-1" />
        </div>

        {/* Service Popularity Chart Skeleton */}
        <div className="w-full">
          <Skeleton className="h-80 w-full rounded-sm" />
        </div>

        {/* Tables Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-sm border bg-card p-6 shadow-sm">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-64" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4 rounded-sm border bg-card p-6 shadow-sm">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-64" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        {/* Full Width Table Skeleton */}
        <div className="space-y-4 rounded-sm border bg-card p-6 shadow-sm">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
