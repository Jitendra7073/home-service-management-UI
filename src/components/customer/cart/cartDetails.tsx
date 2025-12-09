"use client";

import React, { useState, useMemo } from "react";
import { MapPin, CreditCard, Check, ChevronRight } from "lucide-react";
import Address from "@/components/customer/cart/address";
import Payment from "@/components/customer/cart/payment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CartItems from "./cartItems";
import { toast } from "sonner";

export default function HomeServiceCart() {
  const clientQuery = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await fetch("/api/customer/cart");
      return await res.json();
    },
  });

  const steps = [
    {
      id: 1,
      title: "Address",
      icon: MapPin,
      description: "Select service location",
    },
    {
      id: 2,
      title: "Payment",
      icon: CreditCard,
      description: "Complete booking",
    },
  ];

  const canProceed = () => {
    if (currentStep === 1) return selectedAddress !== null;
    return true;
  };

  const handleRemoveFromCart = async (id: string) => {
    const res = await fetch(`/api/customer/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: id }),
    });

    const response = await res.json();

    if (!res.ok) {
      toast.error(response.msg || "Unable to remove item");
      return;
    }

    toast.success(response.msg || "Item removed from cart");

    clientQuery.invalidateQueries(["cart-items"]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-lg md:text-2xl uppercase font-semibold text-gray-800 mb-8">
          Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEPPER */}
            <div className="bg-white rounded-md shadow-sm p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-md flex items-center justify-center ${
                          currentStep > step.id
                            ? "bg-green-500 text-white"
                            : currentStep === step.id
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}>
                        {currentStep > step.id ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>

                      <p className="mt-2 text-sm font-medium text-gray-700 hidden md:block">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 hidden md:block">
                        {step.description}
                      </p>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded ${
                          currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* FORM STEPS */}
            <div className="bg-white rounded-md shadow-sm p-6">
              {currentStep === 1 && (
                <Address
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />
              )}

              {currentStep === 2 && (
                <Payment cartData={data} selectedAddress={selectedAddress} />
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex gap-4 mt-6">
                {/* STEP 2 → Back Button */}
                {currentStep === 2 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-6 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                    Back
                  </button>
                )}

                {/* STEP 1 → Continue Button */}
                {currentStep === 1 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceed()}
                    className={`flex-1 py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 ${
                      canProceed()
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION — CART SUMMARY */}
          <div className="space-y-6">
            <div className="bg-white rounded-md shadow-sm p-6 sticky top-4">
              <h2 className="text-md font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* CART ITEMS */}
              <CartItems
                data={data}
                isLoading={isLoading}
                isError={isError}
                isPending={isPending}
                clickHandle={handleRemoveFromCart}
              />

              {/* PRICE SUMMARY */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
