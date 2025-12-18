"use client";

import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentProps {
  cartData: any;
  selectedAddress: string | null;
}

const Payment: React.FC<PaymentProps> = ({ cartData, selectedAddress }) => {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    const cartItems = cartData?.cart || [];

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // business validation
    const businessIds = cartItems.map((item: any) => item.business.id);
    const uniqueBusinessIds = [...new Set(businessIds)];

    if (uniqueBusinessIds.length > 1) {
      toast.error("You can only book services from the same business.");
      return;
    }

    const cartItemIds = cartItems.map((item: any) => item.id);

    try {
      setLoading(true);

      const res = await fetch("/api/customer/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItemIds,
          addressId: selectedAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg);
        return;
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error(error);
      toast.error("Payment error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleStripeCheckout}
        disabled={loading}
        className="w-full py-3 rounded-md bg-gray-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition disabled:bg-gray-400">
        <CreditCard className="w-5 h-5" />
        {loading ? "Processing..." : "Proceed to Secure Payment"}
      </button>
    </div>
  );
};

export default Payment;
