import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function StaffBusinessesSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-72 animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />

      {/* Business Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded-sm w-16" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Address */}
                <div className="h-4 bg-gray-200 rounded w-full" />

                {/* Service Count */}
                <div className="h-4 bg-gray-200 rounded w-40" />

                {/* Services Preview */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>

              {/* Apply Button Skeleton */}
              <div className="h-10 bg-gray-200 rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
