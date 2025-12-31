"use client";

import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed | Fixora",
  description: "Your payment was not completed. Manage your bookings with Fixora.",
};


interface FailedPopupProps {
  onClose?: () => void;
}

export default function FailedPopup({ onClose }: FailedPopupProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/customer/explore");
      onClose && onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-card rounded-sm p-8 shadow-sm text-center max-w-sm w-full animate-fadeIn">
        <div className="flex justify-center mb-4">
          <XCircle className="text-destructive w-16 h-16 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">Payment Failed</h2>

        <p className="text-gray-600 mt-2">
          Your payment was not completed. Redirecting you…
        </p>
      </div>
    </div>
  );
}
