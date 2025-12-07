"use client";

import { useMemo, useState, useEffect } from "react";
import { Phone, Mail, Globe, ShieldCheck } from "lucide-react";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PoliciesGrid from "@/components/customer/serviceDetails/policies";
import FeaturePill from "@/components/customer/serviceDetails/featurepill";
import OtherServicesGrid from "@/components/customer/serviceDetails/otherservices";
import {
  InfoRow,
  SummaryRow,
} from "@/components/customer/serviceDetails/info-summary-row";
import ServiceDetailSkeleton from "@/components/customer/serviceDetails/loadingSkeleton";
import { toast } from "sonner";
import SlotsSelector from "@/components/customer/serviceDetails/timeslots";


interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  durationInMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  category: Category;
  slots: Slot[];
}

interface BusinessProfile {
  id: string;
  businessName: string;
  contactEmail: string | null;
  phoneNumber: string | null;
  websiteURL: string | null;
  socialLinks?: any;
  isActive: boolean;
  services: Service[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark: string;
  userId: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  mobile: string;
  businessProfile: BusinessProfile;
  addresses: Address[];
}

export default function ServiceDetailPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [isBooking, setIsBooking] = useState(false);

  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: async () => {
      const res = await fetch(`/api/customer/providers/${providerId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch provider");
      }
      const json = await res.json();
      return (json.provider || json) as Provider;
    },
    enabled: !!providerId,
  });

  const provider = rawData ?? null;


  const businessProfile = provider?.businessProfile ?? null;

  const service: Service | null = useMemo(() => {
    if (!businessProfile || !serviceId) return null;
    return (
      businessProfile.services.find((s) => s.id === serviceId) ??
      businessProfile.services[0] ??
      null
    );
  }, [businessProfile, serviceId]);

  const groupedSlots = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    if (!service?.slots) return map;

    service.slots.forEach((slot) => {
      const dateStr = new Date(slot.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(slot);
    });
    return map;
  }, [service]);

  const availableDates = useMemo(
    () => Object.keys(groupedSlots),
    [groupedSlots]
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Initialize selected date when dates change
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const slotsForDate: Slot[] =
    (selectedDate && groupedSlots[selectedDate]) || [];

  const availableSlotsCount = slotsForDate.filter((s) => !s.isBooked).length;

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    if (!service || !selectedSlot) {
      toast.error("Please select a time slot first!");
      return;
    }

    try {
      const payload = {
        serviceId: service.id,
        slotId: selectedSlot.id,
      };

      // Start loading UI
      setIsBooking(true);

      const res = await fetch("/api/customer/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("Booking response:", data.data.newBooking.userId);
      if (!res.ok) {
        toast.error(data?.error?.msg || "Booking failed!");
        setIsBooking(false);
        return;
      }

      toast.success("🎉 Booking confirmed successfully!");
      window.location.href = `/customer/booking`;

      // Optional: redirect or refresh UI
      setIsBooking(false);

    } catch (error) {
      toast.error("Something went wrong!");
      setIsBooking(false);
    }
  };

  if (isLoading || !providerId) {
    return <ServiceDetailSkeleton />;
  }

  if (isError || !provider || !businessProfile || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4">
        <div className="text-5xl mb-2">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900">
          Service not available
        </h2>
        <p className="text-gray-600 text-center max-w-sm">
          {error instanceof Error
            ? error.message
            : "We couldn't load this service. Please refresh or try again later."}
        </p>
      </div>
    );
  }

  const primaryAddress = provider.addresses?.[0] || null;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero / Product Card */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 py-7 text-white relative">
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold ">
                        {service.category.name}
                      </p>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                        {service.name}
                      </h1>
                      {service.category.description && (
                        <p className="text-gray-300 text-sm sm:text-base mt-2 max-w-xl">
                          {service.category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-black/30 border border-white/10 rounded-md px-4 py-3 text-right space-y-2">
                        <p className="text-xs text-gray-300">Starting from</p>
                        <p className="text-3xl sm:text-4xl font-black">
                          ₹{service.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Inclusive of taxes
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Trusted professional partner</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <FeaturePill
                      label="Duration"
                      value={`${service.durationInMinutes} min`}
                      icon="⏱"
                    />
                    <FeaturePill
                      label="Rating"
                      value={
                        service.averageRating > 0
                          ? `${service.averageRating.toFixed(1)} / 5`
                          : "No ratings yet"
                      }
                      icon="⭐"
                    />
                    <FeaturePill
                      label="Reviews"
                      value={`${service.reviewCount} review${service.reviewCount === 1 ? "" : "s"
                        }`}
                      icon="💬"
                    />
                    <FeaturePill
                      label="Status"
                      value={service.isActive ? "Available" : "Unavailable"}
                      icon={service.isActive ? "✓" : "⏳"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
                Business Details
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900">
                      {businessProfile.businessName}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mt-1">
                      Provider:{" "}
                      <span className="normal-case capitalize text-gray-800">
                        {provider.name}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow
                      icon={<Phone className="w-4 h-4" />}
                      label="Business Phone"
                      value={businessProfile.phoneNumber || provider.mobile}
                    />

                    <InfoRow
                      icon={<Mail className="w-4 h-4" />}
                      label="Business Email"
                      value={
                        businessProfile.contactEmail || provider.email || "-"
                      }
                    />
                    {businessProfile.websiteURL && (
                      <InfoRow
                        icon={<Globe className="w-4 h-4" />}
                        label="Website"
                        value={businessProfile.websiteURL}
                        isLink
                      />
                    )}
                    {primaryAddress && (
                      <InfoRow
                        icon={<Globe className="w-4 h-4" />}
                        label="Full Address"
                        value={`${primaryAddress.street}, ${primaryAddress.city},
                        ${primaryAddress.state} - ${primaryAddress.postalCode},
                        ${primaryAddress.country}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Slots Selector */}
            <SlotsSelector
              slots={service.slots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />


            <OtherServicesGrid
              services={businessProfile.services}
              currentServiceId={service.id}
            />
            <PoliciesGrid />
          </div>

          {/* RIGHT COLUMN – Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-5">
                  Booking Summary
                </h3>

                {/* Service summary */}
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <SummaryRow label="Service" value={service.name} />
                  <SummaryRow
                    label="Duration"
                    value={`${service.durationInMinutes} min`}
                  />
                  <SummaryRow label="Provider" value={provider.name || "N/A"} />
                  <SummaryRow
                    label="Business"
                    value={businessProfile.businessName}
                  />
                </div>

                {/* Selected Slot */}
                {selectedSlot && selectedDate ? (
                  <div className="py-4 border-b border-gray-200 bg-emerald-50 rounded-md px-4 mt-4">
                    <p className="text-[11px] text-emerald-700 font-bold mb-1">
                      SELECTED SLOT
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedDate}
                    </p>
                    <p className="text-xs text-gray-700">
                      {selectedSlot.startTime} – {selectedSlot.endTime}
                    </p>
                  </div>
                ) : (
                  <div className="py-4 border-b border-gray-200 bg-amber-50 rounded-md px-4 mt-4">
                    <p className="text-xs text-amber-800 font-semibold">
                      Select a date and time slot to continue
                    </p>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="py-4 border-b border-gray-200 space-y-2 mt-2">
                  <SummaryRow
                    label="Price per session"
                    value={`₹${service.price.toLocaleString("en-IN")}`}
                  />
                  {/* <SummaryRow label="Quantity" value={`× ${quantity}`} subtle /> */}
                </div>

                {/* Total */}
                <div className="py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{service.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleBooking}
                  disabled={!selectedSlot || isBooking}
                  className={`w-full mt-2 py-3.5 rounded-md text-sm sm:text-base font-black tracking-wide transition-all ${selectedSlot
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}>
                  {isBooking
                    ? "Booking..."
                    : selectedSlot
                      ? "Book Now"
                      : "Select Time Slot"}
                </button>

                {/* Info strip */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-[11px] text-blue-700 font-semibold leading-relaxed">
                  ✓ Secure booking • ✓ Instant confirmation • ✓ 24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
