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
    <section className="w-full rounded-2xl border border-border bg-card px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button> */}

          {isVisibleAddServiceButton && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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
