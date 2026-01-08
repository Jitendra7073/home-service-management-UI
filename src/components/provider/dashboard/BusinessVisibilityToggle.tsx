"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BusinessVisibilityToggleProps {
  business:
    | {
        isActive: boolean;
        isApproved: boolean;
        isRestricted: boolean;
      }
    | undefined;
  onUpdate?: () => void;
}

export function BusinessVisibilityToggle({
  business,
  onUpdate,
}: BusinessVisibilityToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!business) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/provider/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !business.isActive,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to update status");
      }

      toast.success(
        business.isActive
          ? "Business is now hidden from customers"
          : "Business is now visible to customers"
      );

      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = business?.isActive ? "Visible" : "Hidden";
  const tooltipText = business?.isActive
    ? "Hide business from customers"
    : "Show business to customers";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className="gap-2 transition-all">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : business?.isActive ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? "Updating..." : currentStatus}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
