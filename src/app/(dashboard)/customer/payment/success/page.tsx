"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessPopupProps {
  onClose?: () => void;
}

export default function SuccessPopup({ onClose }: SuccessPopupProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/customer/booking");
      onClose && onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-sm p-8 shadow-xl text-center max-w-sm w-full animate-fadeIn">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-600 w-16 h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">Payment Successful</h2>
        <p className="text-gray-600 mt-2">
          Your booking has been confirmed. Redirecting…
        </p>
      </div>
    </div>
  );
}
