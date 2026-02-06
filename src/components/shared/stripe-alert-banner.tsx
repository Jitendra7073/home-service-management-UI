"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CreditCard, ExternalLink, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface StripeAlertBannerProps {
  userType: "staff" | "provider";
  apiPath: string;
}

export function StripeAlertBanner({ userType, apiPath }: StripeAlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: stripeData, isLoading } = useQuery({
    queryKey: [`${userType}-stripe-status`],
    queryFn: async () => {
      const res = await fetch(apiPath, {
        credentials: "include",
      });
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  // Don't show if loading, dismissed, or already connected
  if (isLoading || isDismissed || stripeData?.hasConnected) {
    return null;
  }

  const handleConnect = async () => {
    try {
      const onboardingPath =
        userType === "staff"
          ? "/api/staff/payments/stripe/onboarding"
          : "/api/provider/payments/stripe/onboarding";

      const res = await fetch(onboardingPath, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success && data.onboardingUrl) {
        toast.info("Redirecting to Stripe...", {
          description: "You'll be redirected to complete your account setup",
        });
        setTimeout(() => {
          window.location.href = data.onboardingUrl;
        }, 1500);
      } else {
        toast.error(data.msg || "Failed to generate Stripe onboarding link");
      }
    } catch (error) {
      toast.error("Error connecting to Stripe. Please try again.");
    }
  };

  const message =
    userType === "staff"
      ? "Connect your bank account to receive payments from providers"
      : "Connect your bank account to receive payments from customers";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                Connect Your Bank Account
              </h3>
              <p className="text-sm text-amber-800 mb-3">{message}</p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleConnect}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Connect Bank Account
                </Button>
                <span className="text-xs text-amber-700">
                  Takes 2-3 minutes • Secure & encrypted
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 ml-4 text-amber-600 hover:text-amber-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
