"use client";

import { Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

/* ---------------- COMPONENT ---------------- */

const Results = ({
  services,
  onServiceClick,
  isLoading,
  isError,
}: any) => {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-72 bg-gray-200 rounded-md animate-pulse"
          />
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
      <Card className="p-10 text-center">
        <Zap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No services available</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service: any) => (
        <Card
          key={service.id}
          onClick={() => onServiceClick(service)}
          className="cursor-pointer overflow-hidden rounded-md group border border-gray-200 hover:shadow-md transition py-2"
        >
          

          {/* CONTENT */}
          <div className="p-4">
            <h3 className="font-bold text-gray-900 line-clamp-1">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {service.category.description || service.category.name}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-semibold text-gray-900">
                ₹{service.price.toLocaleString("en-IN")}
              </span>

              <div className="flex items-center text-sm text-gray-600 gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(service.durationInMinutes / 60)} hrs
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
