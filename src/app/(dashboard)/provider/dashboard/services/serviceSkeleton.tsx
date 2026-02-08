"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/provider/tableSkeleton";

const ServiceSkeleton = () => {
  return (
    <div className="flex w-full justify-center animate-pulse">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-8 md:space-y-14">
        {/* ---------- Header Skeleton ---------- */}
        <section className="w-full rounded-sm border px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-sm" />
              <Skeleton className="h-9 w-32 rounded-sm" />
            </div>
          </div>
        </section>

        {/* ---------- Stats Cards Skeleton ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-sm" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---------- Table Skeleton ---------- */}
        <TableSkeleton rows={10} columns={5} />
      </div>
    </div>
  );
};

export default ServiceSkeleton;
