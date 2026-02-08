import { Card, CardContent } from "@/components/ui/card";

export function StaffBookingsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded w-24 animate-pulse"
          />
        ))}
      </div>

      {/* Bookings List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Status & Date */}
                  <div className="flex items-center gap-3">
                    <div className="h-6 bg-gray-200 rounded-sm w-24 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>

                  {/* Service & Customer */}
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                  </div>

                  {/* Location */}
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                </div>

                {/* Arrow */}
                <div className="w-10 h-6 bg-gray-200 rounded ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
