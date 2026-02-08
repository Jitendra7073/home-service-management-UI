"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ManageBusinessSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-pulse">

      {/* ---------------- Page Title ---------------- */}
      <Skeleton className="h-9 w-80" />

      {/* ---------------- Business Details Section ---------------- */}
      <Card className="bg-white sm:p-6 sm:border rounded-sm space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24 rounded-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full max-w-[260px]" />
            </div>
          ))}
        </div>
      </Card>

      {/* ---------------- Time Slots Section ---------------- */}
      <Card className="bg-white sm:p-6 sm:border rounded-sm space-y-4">
        <Skeleton className="h-6 w-40" />

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-sm border p-4 space-y-3"
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full rounded-sm mt-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* ---------------- Delete Business Button ---------------- */}
      <Skeleton className="h-10 w-40 rounded-sm mb-6" />

    </div>
  );
};

export default ManageBusinessSkeleton;
