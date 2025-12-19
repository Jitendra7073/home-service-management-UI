"use client";

import React from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/useCartMutations";

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
  slotData,
}) => {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleCart = () => {
    if (!slotData) return;
    addToCart(slotData);
  };

  return (
    <Button
      disabled={isPending || !slotData}
      onClick={handleCart}
      className={`flex items-center justify-center gap-2 
        bg-gray-100 text-gray-800 border rounded-sm 
        hover:bg-gray-200 hover:border-gray-300 px-3 py-1 text-sm 
        ${classChange ? "w-full" : "w-fit"} 
        ${!slotData ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <ShoppingCart className="w-4 h-4" />
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
