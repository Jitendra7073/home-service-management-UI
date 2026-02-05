"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, MapPin, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProfileCompletionData {
  isComplete: boolean;
  hasAddress: boolean;
  hasCard: boolean;
  addressCount: number;
  cardCount: number;
}

export function StaffProfileCompletionAlert() {
  const { data: completionData, isLoading } = useQuery({
    queryKey: ["staff-profile-completion"],
    queryFn: async () => {
      const res = await fetch("/api/staff/profile/completion", {
        credentials: "include",
      });
      return res.json();
    },
    refetchOnWindowFocus: true,
  });

  const profileCompletion: ProfileCompletionData =
    completionData?.profileCompletion || {
      isComplete: true,
      hasAddress: true,
      hasCard: true,
      addressCount: 0,
      cardCount: 0,
    };

  // Don't show alert if loading or profile is complete
  if (isLoading || profileCompletion.isComplete) {
    return null;
  }

  const missingItems = [];
  if (!profileCompletion.hasAddress) {
    missingItems.push({
      name: "Address",
      icon: MapPin,
      link: "/staff/profile?tab=addresses",
    });
  }
  if (!profileCompletion.hasCard) {
    missingItems.push({
      name: "Payment Method",
      icon: CreditCard,
      link: "/staff/profile?tab=payment",
    });
  }

  if (missingItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-right">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-500 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-900">
                You're Almost Ready!
              </h4>
            </div>

            <p className="text-xs text-amber-800 mb-3">
              Add the following details to activate bookings:
            </p>

            <div className="space-y-2">
              {missingItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.link} className="block">
                    <div className="w-full flex items-center justify-between p-2 bg-white rounded border border-amber-200 hover:border-amber-400 transition-colors">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-900">
                          Add {item.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
            onClick={() => {
              // Dismiss by hiding - it will reappear on page refresh
              const el = document.querySelector(".fixed.bottom-4.right-4");
              if (el) el.remove();
            }}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
