"use client";

import { Skeleton } from "@/components/ui/skeleton";

const PricingSkeleton = () => {
  return (
    <div className="relative flex flex-col rounded-sm border p-6 h-[450px] w-full mx-auto">
      <div className="mb-6 text-center space-y-3">
        <Skeleton className="h-6 w-32 mx-auto animate-pulse" />
        <Skeleton className="h-10 w-40 mx-auto animate-pulse" />
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <li key={i} className="flex gap-3 items-center">
            <Skeleton className="h-4 w-4 rounded-sm animate-pulse" />
            <Skeleton className="h-4 w-full max-w-[220px] animate-pulse" />
          </li>
        ))}
      </ul>

      <Skeleton className="h-10 w-full rounded-sm animate-pulse" />

      <Skeleton className="h-3 w-40 mx-auto mt-4" />
    </div>
  );
};

export default PricingSkeleton;
