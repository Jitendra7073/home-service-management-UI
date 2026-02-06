"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Loader2, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AvailabilityStatus = "AVAILABLE" | "NOT_AVAILABLE" | "ON_WORK" | "BUSY";

interface StaffAvailabilityToggleProps {
  currentAvailability: AvailabilityStatus;
  isOnLeave?: boolean;
}

export function StaffAvailabilityToggle({
  currentAvailability,
  isOnLeave = false,
}: StaffAvailabilityToggleProps) {
  const queryClient = useQueryClient();

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (newAvailability: "AVAILABLE" | "NOT_AVAILABLE") => {
      const res = await fetch("/api/staff/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ availability: newAvailability }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Availability updated successfully");
        queryClient.invalidateQueries({ queryKey: ["staff-profile"] });
        queryClient.invalidateQueries({ queryKey: ["staff-dashboard-stats"] });
      } else {
        toast.error(data.msg || "Failed to update availability");
      }
    },
    onError: () => {
      toast.error("Failed to update availability");
    },
  });

  const handleToggleAvailability = () => {
    const isAvailable = currentAvailability === "AVAILABLE";
    const newAvailability = isAvailable ? "NOT_AVAILABLE" : "AVAILABLE";
    updateAvailabilityMutation.mutate(newAvailability);
  };

  const getStatusBadge = () => {
    switch (currentAvailability) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Available
          </Badge>
        );
      case "NOT_AVAILABLE":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Not Available
          </Badge>
        );
      case "ON_WORK":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            On Work
          </Badge>
        );
      case "BUSY":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            <Loader2 className="w-3 h-3 mr-1" />
            Busy
          </Badge>
        );
    }
  };

  const getStatusMessage = () => {
    switch (currentAvailability) {
      case "AVAILABLE":
        return "You are visible to providers for new bookings";
      case "NOT_AVAILABLE":
        return "You are not visible to providers for new bookings";
      case "ON_WORK":
        return "You are currently working on an active booking";
      case "BUSY":
        return "You have an active booking";
    }
  };

  const canToggle =
    (currentAvailability === "AVAILABLE" ||
      currentAvailability === "NOT_AVAILABLE") &&
    !isOnLeave;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Current Availability
            </h3>
            <div className="flex items-center gap-3 mb-2">
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          </div>

          {canToggle && (
            <Button
              onClick={handleToggleAvailability}
              disabled={updateAvailabilityMutation.isPending}
              variant={
                currentAvailability === "AVAILABLE" ? "destructive" : "default"
              }
              className="shrink-0">
              {updateAvailabilityMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : currentAvailability === "AVAILABLE" ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Set Not Available
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Set Available
                </>
              )}
            </Button>
          )}
        </div>

        {!canToggle && (
          <div
            className={`mt-4 p-3 border rounded-lg ${
              isOnLeave
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            }`}>
            <p
              className={`text-sm ${
                isOnLeave ? "text-orange-800" : "text-blue-800"
              }`}>
              {isOnLeave ? (
                <>
                  <CalendarClock className="inline w-4 h-4 mr-1" />
                  <strong>Note:</strong> Your availability is automatically
                  managed while you are on leave. You cannot change it during
                  this period.
                </>
              ) : (
                <>
                  <strong>Note:</strong> Your availability is automatically
                  managed based on your active bookings. You can toggle this
                  when you have no active bookings.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
