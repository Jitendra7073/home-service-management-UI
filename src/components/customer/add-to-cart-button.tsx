"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface SlotPayload {
  serviceId: string;
  slotId: string;
  businessId: string;
  date: string;
}

interface AddToCartButtonProps {
  classChange?: boolean;
  serviceId: string;
  slotData?: SlotPayload | null;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  classChange = false,
  serviceId,
  slotData,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCart = async () => {
    if (!slotData) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotData),
      });

      const { data } = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.msg || "Unable to add to cart");
      } else {
        toast.success(data.msg || "Added to cart successfully");
      }
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading || !slotData}
      onClick={handleCart}
      className={`flex items-center justify-center gap-2 
        bg-gray-100 text-gray-800 border rounded-sm 
        hover:bg-gray-200 hover:border-gray-300 px-3 py-1 text-sm 
        ${classChange ? "w-full" : "w-fit"} 
        ${!slotData ? "cursor-not-allowed opacity-60" : ""}`}>
      <ShoppingCart className="w-4 h-4" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
