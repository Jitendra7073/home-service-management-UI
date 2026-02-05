import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StaffBookingDetailSkeleton() {
  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />

        {/* Stepper Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10 rounded" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-1 relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-16 mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-56 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
            </div>

            {/* Date, Time, Price */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-7 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>

            {/* Customer Information */}
            <div className="border-t pt-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-44 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
            </div>

            {/* Service Location */}
            <div className="border-t pt-4 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-80 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Status Actions Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
