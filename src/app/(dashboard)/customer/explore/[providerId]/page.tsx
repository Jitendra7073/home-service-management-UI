"use client";

import React, { useMemo, useState } from "react";
import { Phone, Mail, Globe, MapPin, X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// UI Components
import PoliciesGrid from "@/components/customer/serviceDetails/policies";
import FeaturePill from "@/components/customer/serviceDetails/featurepill";
import OtherServicesGrid from "@/components/customer/serviceDetails/otherservices";
import {
  InfoRow,
  SummaryRow,
} from "@/components/customer/serviceDetails/info-summary-row";
import ServiceDetailSkeleton from "@/components/customer/serviceDetails/loadingSkeleton";
import AddToCartButton from "@/components/customer/add-to-cart-button";
import SlotsSelector from "@/components/customer/serviceDetails/timeslots";
import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Slot {
  id: string;
  time: string;
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
  coverImage: string;
  images: string[];
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
  isActive: boolean;
  services: Service[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const serviceId = searchParams.get("serviceId");

  const [slotDetails, setSlotDetails] = useState<{
    serviceId: string;
    slotId: string;
    businessId: string;
    date: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: async () => {
      const res = await fetch(`/api/customer/providers/${providerId}`);
      if (!res.ok) throw new Error("Failed to load provider");
      const json = await res.json();
      return json.provider as Provider;
    },
    enabled: !!providerId,
  });

  const provider = data || null;
  const business = provider?.businessProfile || null;

  const service = useMemo(() => {
    if (!business || !serviceId) return null;
    return business.services.find((s) => s.id === serviceId) || null;
  }, [business, serviceId]);

  const primaryAddress = provider?.addresses?.[0] || null;
  const images = service?.images ?? [];

  const useCarousel = images.length > 4;

  if (isLoading || !providerId) return <ServiceDetailSkeleton />;

  if (isError || !provider || !business || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4">
        <h2 className="text-xl font-bold text-gray-900">
          Service not available
        </h2>
        <p className="text-gray-600 text-center max-w-sm">
          {error instanceof Error ? error.message : "Unable to load details"}
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-6">
        <div className="relative w-full overflow-hidden rounded-md aspect-[16/8] md:aspect-[19/7] shadow-sm">
          <Image
            src={service.coverImage || "/home-service-banner.jpeg"}
            alt={service.name || "Service Name"}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* SERVICE HEADER CARD */}
            <div className="relative bg-white rounded-md overflow-hidden shadow-xs border">
              <div className="w-full bg-gray-800 backdrop-blur-xs px-6 py-6 text-white">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-widest text-gray-100">
                    {service.category.name}
                  </p>

                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {service.name}
                  </h1>

                  {service.category.description && (
                    <p className="text-sm text-white">
                      {service.category.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <FeaturePill
                      label="Duration"
                      value={`${
                        (service.durationInMinutes / 60)
                          .toFixed(2)
                          .split(".")[0]
                      } ${service.durationInMinutes < 60 ? "Min" : "Hrs"} ${
                        (service.durationInMinutes / 60)
                          .toFixed(2)
                          .split(".")[1] == "00"
                          ? ""
                          : (service.durationInMinutes / 60)
                              .toFixed(2)
                              .split(".")[1] + " Min"
                      } 
                      `}
                    />

                    <FeaturePill
                      label="Rating"
                      value={
                        service.averageRating > 0
                          ? `${service.averageRating.toFixed(1)} / 5`
                          : "No ratings"
                      }
                    />
                    <FeaturePill
                      label="Reviews"
                      value={`${service.reviewCount} review${
                        service.reviewCount !== 1 ? "s" : ""
                      }`}
                    />
                    <FeaturePill
                      label="Status"
                      value={service.isActive ? "Available" : "Unavailable"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BUSINESS DETAILS */}
            <div className="bg-white rounded-sm shadow-xs border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Business Details
              </h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                {business.businessName}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={business.phoneNumber || provider.mobile}
                />
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={business.contactEmail || provider.email}
                />

                {business.websiteURL && (
                  <InfoRow
                    icon={<Globe className="w-4 h-4" />}
                    label="Website"
                    value={business.websiteURL}
                    isLink
                  />
                )}

                {primaryAddress && (
                  <InfoRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Address"
                    value={`${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} ${primaryAddress.postalCode}`}
                  />
                )}
              </div>
            </div>

            {/* SLOT SELECTOR */}
            <SlotsSelector
              slots={data?.businessProfile?.slots || []}
              serviceId={service.id}
              businessId={business.id}
              onSelect={(details) => {
                setSlotDetails(details);
              }}
            />

            {/* OTHER SERVICES */}
            <OtherServicesGrid
              services={business.services}
              currentServiceId={service.id}
            />

            {/* POLICIES GRID */}
            <PoliciesGrid />

            {/* OUR GALLERY */}
            {images.length > 0 && 
              <div>
                <div className="bg-white rounded-sm border p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Our Gallery
                  </h2>

                  {!useCarousel && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(image)}
                          className="relative aspect-square overflow-hidden rounded-md">
                          <Image
                            src={image}
                            alt="Service Image"
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {useCarousel && (
                    <Carousel
                      opts={{
                        align: "start",
                        slidesToScroll: 1,
                      }}
                      className="relative">
                      <CarouselContent className="-ml-3">
                        {images.map((image, index) => (
                          <CarouselItem
                            key={index}
                            className="
                    pl-3
                    basis-1/2
                    sm:basis-1/3
                    lg:basis-1/4
                  ">
                            <button
                              onClick={() => setActiveImage(image)}
                              className="relative aspect-square overflow-hidden rounded-md w-full">
                              <Image
                                src={image}
                                alt="Service Image"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  )}
                </div>

                <Dialog
                  open={!!activeImage}
                  onOpenChange={() => setActiveImage(null)}>
                  <DialogContent className=" p-1  max-w-[95vw] sm:max-w-3xl border-none">
                    {activeImage && (
                      <Image
                        src={activeImage}
                        alt="Preview"
                        width={1200}
                        height={1200}
                        className="w-full h-auto max-h-[75vh] sm:max-h-[85vh] object-contain rounded-md"
                        priority
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            }
          </div>

          {/* RIGHT SIDE — BOOKING SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-sm shadow-xs border p-6 sm:p-8">
                <h3 className="text-xl font-black text-gray-900 mb-5">
                  Booking Summary
                </h3>

                <div className="space-y-3 pb-4 border-b">
                  <SummaryRow label="Service" value={service.name} />
                  <SummaryRow
                    label="Duration"
                    value={`${
                      (service.durationInMinutes / 60).toFixed(2).split(".")[0]
                    } ${service.durationInMinutes < 60 ? "Min" : "Hrs"} ${
                      (service.durationInMinutes / 60)
                        .toFixed(2)
                        .split(".")[1] == "00"
                        ? ""
                        : (service.durationInMinutes / 60)
                            .toFixed(2)
                            .split(".")[1] + " Min"
                    } 
                      `}
                  />
                  <SummaryRow label="Provider" value={provider.name} />
                  <SummaryRow label="Business" value={business.businessName} />
                </div>

                <div className="py-4 border-b space-y-2">
                  <SummaryRow
                    label="Price"
                    value={`₹${service.price.toLocaleString("en-IN")}`}
                  />
                </div>

                <div className="py-4 flex justify-between">
                  <span className="text-sm font-semibold">Total Amount</span>
                  <span className="text-2xl font-black">
                    ₹{service.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* ADD TO CART — Only enabled if slot selected */}
                <AddToCartButton
                  classChange={true}
                  serviceId={service.id}
                  slotData={slotDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
