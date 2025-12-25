"use client";

import { Button } from "@/components/ui/button";
import { ServiceModelState } from "@/global-states/state";
import { useSetAtom } from "jotai";
import { Download, PlusCircleIcon } from "lucide-react";

interface BookingHeaderProps {
  title?: string;
  description?: string;
  isVisibleAddServiceButton?: boolean;
}

export default function BookingHeader({
  title,
  description,
  isVisibleAddServiceButton = false,
}: BookingHeaderProps) {
  const setServiceModelOpen = useSetAtom(ServiceModelState);

  return (
    <section className="w-full rounded-2xl border bg-gray-50 px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {title}
          </h1>
          <p className="text-sm text-gray-600 max-w-xl">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button> */}

          {isVisibleAddServiceButton && (
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              onClick={() => setServiceModelOpen(true)}
            >
              <PlusCircleIcon className="w-4 h-4 mr-1" />
              Add New Service
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
