"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, Shield, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StripeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export function StripeConnectModal({
  isOpen,
  onClose,
  onConnected,
}: StripeConnectModalProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { mutate: getOnboardingLink, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/staff/payments/stripe/onboarding", {
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.onboardingUrl) {
        // Redirect to Stripe onboarding
        setIsRedirecting(true);
        toast.info("Redirecting to Stripe...", {
          description: "You'll be redirected to complete your account setup",
        });
        setTimeout(() => {
          window.location.href = data.onboardingUrl;
        }, 1500);
      } else {
        toast.error(data.msg || "Failed to generate Stripe onboarding link");
      }
    },
    onError: () => {
      toast.error("Error connecting to Stripe. Please try again.");
    },
  });

  const handleConnectStripe = () => {
    getOnboardingLink();
  };

  const handleLater = () => {
    toast.info("Stripe account required", {
      description: "You must connect your Stripe account to receive payments",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Connect Your Stripe Account
          </DialogTitle>
          <DialogDescription>
            To receive payments for your services, you need to connect your
            Stripe account. This ensures secure and timely payouts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Why Stripe */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Secure & Trusted Payouts
                </h4>
                <p className="text-sm text-blue-700">
                  Stripe is the industry standard for secure payments. Your
                  earnings will be deposited directly to your bank account.
                </p>
              </div>
            </div>
          </div>

          {/* What you need */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              What You'll Need
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Bank account details</strong> - where you want to
                  receive payments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Personal information</strong> - name, address, and
                  date of birth
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Government ID</strong> - for identity verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Tax information</strong> - required for compliance
                </span>
              </li>
            </ul>
          </div>

          {/* Important note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">
                  Important Note
                </h4>
                <p className="text-sm text-amber-800">
                  All payments for your completed services will be transferred to
                  this Stripe account. Please ensure all details are accurate.
                </p>
              </div>
            </div>
          </div>

          {/* Payout timing */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              When Will You Receive Payments?
            </h4>
            <p className="text-sm text-green-700">
              Once a payment is approved by the provider, funds will appear in
              your bank account within <strong>2-3 business days</strong>,
              depending on your bank's processing time.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleLater}
            className="flex-1"
            disabled={isRedirecting}
          >
            Remind Me Later
          </Button>
          <Button
            onClick={handleConnectStripe}
            disabled={isLoading || isRedirecting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Link...
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect Stripe
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
