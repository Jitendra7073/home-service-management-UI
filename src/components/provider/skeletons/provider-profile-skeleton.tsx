import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StaffProfileSkeleton() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-72 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar Skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />

              {/* Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-28 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Associated Businesses Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-36 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
