"use client";

import { ServiceModelState } from "@/global-states/state";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceAwarenessModal = () => {
  const setServiceModelOpen = useSetAtom(ServiceModelState);

  const [isDismissed, setIsDismissed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/provider/service", {
        method: "GET",
      });
      return res.json();
    },
  });

  const serviceCount =
    typeof data?.count === "number"
      ? data.count
      : Array.isArray(data)
        ? data?.length
        : 0;

  if (isLoading || isDismissed || serviceCount > 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] rounded-sm border bg-white shadow-lg p-4 animate-in slide-in-from-bottom-4 fade-in cursor-pointer">
      {/* Close Button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 hover:bg-gray-200 p-1 rounded right-3 text-gray-600 hover:text-gray-600 cursor-pointer">
        <X className="w-4 h-4" />
      </button>

      <div
        className="w-full h-full cursor-pointer"
        onClick={() => setServiceModelOpen(true)}>
        <h3 className="text-sm font-medium text-gray-900">Add a service</h3>

        <p className="mt-1 text-xs text-gray-600">
          You haven’t added any services yet. Adding one helps customers
          understand what you offer.
        </p>
      </div>
    </div>
  );
};

export default ServiceAwarenessModal;
