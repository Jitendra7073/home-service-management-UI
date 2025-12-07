"use client";

import React from "react";
import { Calendar, Clock, Star, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  durationInMinutes: number;
  price: number;
  isActive: boolean;
  slots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }>;
}

export type ExtendedService = Service & {
  businessId: string;
  providerId: string;
  providerName: string;
  rating: number | undefined;
};

interface ResultsProps {
  services: ExtendedService[];
  onServiceClick: (service: ExtendedService) => void;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const Results: React.FC<ResultsProps> = ({
  services,
  onServiceClick,
  isLoading,
  isError,
  error,
}) => {
  if (services.length === 0) {
    return (

      <Card className="bg-white border-gray-200">
        <CardContent className="py-12 text-center">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Services Found
          </h3>
          <div className="flex justify-center">
            <p className="text-sm sm:text-[16px] text-gray-500 w-auto sm:w-100 items-center">
              We couldn't find any services that match your search. Try adjusting
              your filters or search terms to see more results.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-md overflow-hidden border border-gray-200 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-32 bg-gray-300/40 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6">
              {/* Price & Duration */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                  <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-md"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
                </div>
              </div>

              {/* Provider & Rating */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="h-3 w-20 bg-gray-300 rounded-md mb-2"></div>

                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-gray-300 rounded-md"></div>

                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-6 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="h-3 w-24 bg-gray-300 rounded-md mb-2"></div>

                <div className="h-10 bg-gray-200 rounded-md border border-gray-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:col-span-3 text-center py-20">
        <div className="text-7xl mb-6 opacity-30">⚠️</div>
        <h3 className="text-3xl font-black text-gray-900 mb-3">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          An error occurred while fetching the services. Please try again later.
          <br />
          <span className="text-red-500">
            {error?.message || String(error)}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => onServiceClick(service)}
          className="bg-white rounded-md overflow-hidden transition-all duration-300 group border hover:shadow-md hover:border-gray-400 cursor-pointer">
          {/* Header */}
          <div className="h-32 bg-gray-800 relative overflow-hidden p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                  {service.name}
                </h3>
                <p className="text-gray-300 text-sm font-semibold">
                  {service.category.name}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Price & Duration */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">Price</span>
                <span className="text-2xl font-black text-gray-900">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {service.durationInMinutes} minutes
                </span>
              </div>
            </div>

            {/* Provider & Rating */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-semibold">
                PROVIDER
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">
                  {service.providerName}
                </p>
                {service.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gray-400 text-gray-400" />
                    <span className="text-xs font-bold text-gray-900">
                      {service.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Available Slots */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2 font-semibold">
                AVAILABILITY
              </p>
              {service.slots && service.slots.length > 0 ? (
                service.slots.filter((s) => !s.isBooked).length > 0 ? (
                  <div className="bg-green-50 rounded-md px-3 py-2 border border-green-200">
                    <p className="text-sm font-semibold text-green-700">
                      {service.slots.filter((s) => !s.isBooked).length} slots
                      available
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-md px-3 py-2 border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-700">
                      All slots are booked
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-red-50 rounded-md px-3 py-2 border border-red-200">
                  <p className="text-sm font-semibold text-red-700">
                    No slots available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Results;
