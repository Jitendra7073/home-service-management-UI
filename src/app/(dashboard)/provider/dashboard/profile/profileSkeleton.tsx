"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ===== PROFILE HEADER ===== */}
        <Card className="shadow-md rounded-md overflow-hidden">
          <CardContent className="p-0">
            {/* Cover */}
            <div className="h-24 sm:h-32 bg-gray-300" />

            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

                {/* Avatar + Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 flex-1">
                  <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white" />

                  <div className="text-center sm:text-left space-y-2 flex-1">
                    <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />

                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden sm:flex flex-col gap-2">
                  <Skeleton className="h-10 w-40 rounded-md" />
                  <Skeleton className="h-10 w-40 rounded-md" />
                </div>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== PERSONAL INFO ===== */}
        <Card className="shadow-md rounded-md">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4 sm:p-6">
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-64 mt-2" />
            </div>

            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full mt-2 rounded-md" />
            </div>

            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-40 mt-2" />
            </div>

            <div className="pt-2 border-t">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* ===== ADDRESS INFO ===== */}
        <Card className="shadow-md rounded-md">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4">
            <Skeleton className="h-5 w-40" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* ===== MOBILE ACTION BUTTONS ===== */}
        <div className="sm:hidden flex flex-col gap-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

      </div>
    </div>
  );
};

export default ProfileSkeleton;
