import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-[200px]" />
            <Skeleton className="h-6 w-[80px] rounded-full" />
            <Skeleton className="h-6 w-[100px] rounded-full" />
          </div>
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-10 w-[140px] rounded-md" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card Skeleton */}
        <Card className="lg:col-span-1 h-fit sticky top-20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-[140px]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-[90px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Business & Activity Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-[140px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-[200px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs Skeleton */}
          <Card>
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-6 w-[140px]" />
                </div>
                <Skeleton className="h-4 w-[280px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              {/* Filter Section Skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <Skeleton className="h-10 w-[180px] rounded-md" />
                <Skeleton className="h-4 w-[200px] ml-auto" />
              </div>

              {/* Activity Log Items Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Skeleton className="h-3 w-[120px]" />
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-3 w-[100px] ml-auto" />
                    </div>

                    {/* Timestamp */}
                    <div className="pt-2 border-t">
                      <Skeleton className="h-3 w-[180px]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-[100px] rounded-md" />
                    <Skeleton className="h-9 w-[80px] rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
