"use client";

import { ChevronRight, StarIcon, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------- COMPONENT ---------------- */

const Results = ({ services, onServiceClick, isLoading, isError }: any) => {
  // Helper to render stars
  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-100"
              }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating > 0 ? rating.toFixed(1) : ""}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-7 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <Skeleton className="h-3 w-1/3 mt-2 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <Zap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          {"Failed to load services, please refresh the page!"}
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="bg-white border-gray-200 h-full">
        <CardContent className="h-full flex flex-col justify-center items-center">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Services found
          </h3>
          <p className="text-gray-600">Any new service will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service: any) => (
        <Card
          key={service.id}
          onClick={() => onServiceClick(service)}
          className="group relative block bg-white rounded-sm overflow-hidden
                   border border-gray-200 hover:border-blue-200
                   hover:shadow-lg transition-all py-2 cursor-pointer">
          {/* CONTENT */}
          <div className="p-4">
            <div className="flex items-center gap-3 justify-between">
              <h3 className="font-bold text-gray-900 line-clamp-1 flex-1">
                {service.name}
              </h3>
              <ChevronRight
                className="w-4 h-4 text-blue-600 opacity-0
                           group-hover:opacity-100 transition-opacity shrink-0"
              />
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1 min-h-[2.5em]">
              {service.category.description || service.category.name}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-semibold text-gray-900">
                ₹{service.price.toLocaleString("en-IN")}
              </span>

              <div className="flex items-center">
                {renderStars(service.averageRating || 0)}
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              By {service.providerName}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Results;
