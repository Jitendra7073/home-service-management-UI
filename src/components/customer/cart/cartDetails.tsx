"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ShoppingCart,
  AlertCircle,
  Clock,
} from "lucide-react";
import Address from "@/components/customer/cart/address";
import Payment from "@/components/customer/cart/payment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CartItems from "./cartItems";
import { toast } from "sonner";
import ExploreHeader from "../explore/exploreHeroSection";

export default function HomeServiceCart() {
  const clientQuery = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

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

  /* 
     SLOT DATE + TIME VALIDATION (FINAL & SAFE)
   */
  const slotTimeWarning = useMemo(() => {
    const cartItems = data?.cart || [];
    const now = new Date();

    for (const item of cartItems) {
      if (!item?.date || !item?.slot?.time) continue;

      /* Parse base date (ISO safe) */
      const slotDateTime = new Date(item.date);
      if (Number.isNaN(slotDateTime.getTime())) continue;

      /* Parse slot time (12-hour AM/PM) */
      const match = item.slot.time.match(/(\d+):(\d+)\s?(AM|PM)/i);
      if (!match) continue;

      let [, hourStr, minuteStr, meridian] = match;
      let hours = Number(hourStr);
      const minutes = Number(minuteStr);

      if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

      /* Combine date + time */
      slotDateTime.setHours(hours, minutes, 0, 0);

      /* Compare with now */
      const diffMinutes =
        (slotDateTime.getTime() - now.getTime()) / (1000 * 60);

      /* Slot already passed */
      if (diffMinutes <= 0) {
        return {
          show: true,
          type: "PAST",
          message: "This service slot has already passed.",
          slotTime: item.slot.time,
          slotDate: slotDateTime.toLocaleDateString("en-IN"),
        };
      }

      /* Slot too close (buffer window) */
      if (diffMinutes <= 10) {
        return {
          show: true,
          type: "NEAR",
          message: `Service slot starts in ${Math.ceil(
            diffMinutes
          )} minute(s).`,
          slotTime: item.slot.time,
          slotDate: slotDateTime.toLocaleDateString("en-IN"),
        };
      }
    }

    return { show: false };
  }, [data?.cart]);

  /* 
     NAVIGATION GUARD
   */
  const canProceed = () => {
    if (slotTimeWarning.show) return false;
    if (currentStep === 1) return selectedAddress !== null;
    return true;
  };

  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  /* 
     REMOVE ITEM
   */
  const handleRemoveFromCart = async (id: string) => {
    setRemovingItemId(id);
    try {
      const res = await fetch(`/api/customer/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: id }),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.msg || "Unable to remove item");
        return;
      }

      toast.success(response.msg || "Item removed from cart");
      clientQuery.invalidateQueries({ queryKey: ["cart-items"] });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setRemovingItemId(null);
    }
  };

  return (
    <div>
      <ExploreHeader
        totalServices={0}
        filteredCount={0}
        totalProviders={0}
        isVisible={false}
        heading="My Cart"
        description="Review your selected services and proceed to checkout."
        icons={<ShoppingCart className="w-8 h-8 text-gray-300" />}
      />

      <div className="min-h-screen bg-gray-100 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT */}
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
                            currentStep > step.id
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* FORM */}
              <div className="bg-white rounded-md shadow-sm p-6">
                {/* SLOT WARNING */}
                {slotTimeWarning.show && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-800 mb-1">
                        This Time Slot Is Unavailable
                      </p>

                      <p className="text-sm text-red-700">
                        {slotTimeWarning.message} Please choose a different time
                        to continue with your booking.
                      </p>

                      <p className="text-xs text-red-600 mt-2">
                        Selected slot:{" "}
                        <strong>{slotTimeWarning.slotDate}</strong> at{" "}
                        <strong>{slotTimeWarning.slotTime}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <Address
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                  />
                )}

                {currentStep === 2 && (
                  <Payment cartData={data} selectedAddress={selectedAddress} />
                )}

                {/* NAV BUTTONS */}
                <div className="flex gap-4 mt-6">
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-3 px-6 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
                      Back
                    </button>
                  )}

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

            {/* RIGHT */}
            <div className="space-y-6">
              <div className="bg-white rounded-md shadow-sm p-6 sticky top-4">
                <h2 className="text-md font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>

                <CartItems
                  data={data}
                  isLoading={isLoading}
                  isError={isError}
                  isPending={isPending}
                  removingItemId={removingItemId}
                  clickHandle={handleRemoveFromCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
