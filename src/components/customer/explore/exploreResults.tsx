"use client";

import React from "react";
import { Calendar, Clock, ShoppingCart, Star, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddToCartButton from "../add-to-cart-button";

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
              We couldn't find any services that match your search. Try
              adjusting your filters or search terms to see more results.
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
            className="bg-white rounded-sm overflow-hidden border border-gray-200 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-32 bg-gray-300/40 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-300 rounded-sm"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6">
              {/* Price & Duration */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-20 bg-gray-300 rounded-sm"></div>
                  <div className="h-6 w-24 bg-gray-300 rounded-sm"></div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 rounded-sm px-3 py-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded-sm"></div>
                </div>
              </div>

              {/* Provider & Rating */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="h-3 w-20 bg-gray-300 rounded-sm mb-2"></div>

                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-gray-300 rounded-sm"></div>

                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
                    <div className="h-4 w-6 bg-gray-300 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="h-3 w-24 bg-gray-300 rounded-sm mb-2"></div>

                <div className="h-10 bg-gray-200 rounded-sm border border-gray-300"></div>
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
          className="group border border-gray-200 rounded-sm bg-white transition-all p-5 hover:shadow-md hover:border-gray-300 cursor-pointer"
          onClick={() => onServiceClick(service)}>
          {/* Service Name */}
          <h3 className="flex justify-between items-center gap-1 text-md font-bold text-gray-900 line-clamp-2 mb-2  ">
            {service.name}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {service.category.description}
          </p>

          {/* Price and Time */}
          <div className="flex items-center justify-between ">
            <span className="text-md font-semibold text-gray-800">
              ₹{service.price.toLocaleString("en-IN")}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-800">
              <Clock className="w-4 h-4" />
              <span>{service.durationInMinutes} min</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Results;
