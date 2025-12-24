"use client";

import { Skeleton } from "@/components/ui/skeleton";

const PricingSkeleton = () => {
  return (
    <div className="flex justify-center w-full animate-pulse">
      <div className="w-full max-w-[1400px] px-4 space-y-10">
        {/* ----------- Hero Skeleton ----------- */}
        <div className="space-y-4 text-center py-10">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto max-w-full" />
        </div>

        {/* ----------- Pricing Cards Skeleton ----------- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12 max-w-[1200px] mx-auto">
          {[...Array(3)].map((_, index) => (
            <div className="relative flex flex-col rounded-3xl border p-6 animate-pulse h-[400px]">
              <Skeleton className="absolute top-4 right-4 h-6 w-28 rounded-full" />

              <div className="mb-6 text-center space-y-3">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-10 w-40 mx-auto" />
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {[...Array(4)].map((_, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-full max-w-[220px]" />
                  </li>
                ))}
              </ul>

              <Skeleton className="h-10 w-full rounded-full" />

              <Skeleton className="h-3 w-40 mx-auto mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSkeleton;
