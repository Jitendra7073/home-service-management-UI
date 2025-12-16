"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Banknote,
  Calendar,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

/* ================= TYPES ================= */

interface BookingData {
  user: {
    name: string;
    email: string;
    mobile: string;
  };
  address: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string;
    userId: string;
  };
  service: {
    id: string;
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;
    currency: string;
    isActive: boolean;
    coverImage: string;
    images: string[];
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    businessProfileId: string;
    businessCategoryId: string;
  };
  slot: {
    time: string;
  };
  date:string;
  bookingStatus: string;
  paymentStatus: string;
  bookingItems: any[];
  createdAt: string;
  updatedAt: string;
}

export default function BookingDetailsDashboard({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["booking-details", bookingId],
    enabled: !!bookingId,
    queryFn: async () => {
      const res = await fetch(`/api/provider/bookings/${bookingId}`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      return await res.json();
    },
  });

  const booking: BookingData | null = data?.bookings || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No booking data found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hours = Math.floor(booking.service.durationInMinutes / 60);
  const minutes = booking.service.durationInMinutes % 60;

  const bookingStatusClasses = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const paymentStatusClasses = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-[1400px] px-2 md:px-6 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Booking Details
                </h1>
                <Badge
                  className={`${
                    bookingStatusClasses[booking.bookingStatus]
                  } px-2 py-1 rounded`}>
                  {booking.bookingStatus}
                </Badge>

                <Badge
                  className={`${
                    paymentStatusClasses[booking.paymentStatus]
                  } px-2 py-1 rounded`}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-md shadow border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <User className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Full Name
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Mobile
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.user.mobile}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Email Address
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Cover Image */}
                {booking.service.coverImage && (
                  <div className="relative w-full h-75 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={booking.service.coverImage}
                      alt={booking.service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {booking.service.name}
                  </h3>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-3 py-2 rounded-full text-sm font-medium border border-blue-100">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {hours > 0 && `${hours}H `}
                      {minutes > 0 && `${minutes}M`}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-2 rounded-full text-sm font-medium border border-green-100">
                      <Banknote className="w-4 h-4 text-green-600" />
                      {booking.service.currency}{" "}
                      {booking.service.price.toLocaleString()}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    About this service
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {booking.service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="rounded-md border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        Scheduled Time
                      </p>
                      <p className="text-xl font-bold text-blue-900">
                        {booking.slot.time}
                      </p>
                      <p className="text-md font-bold text-blue-900">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md shadow border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Customer Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {booking.address.street}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {booking.address.city}, {booking.address.state}{" "}
                    {booking.address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.address.country}
                  </p>
                  {booking.address.landmark &&
                    booking.address.landmark !== "N/A" && (
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Landmark:</span>{" "}
                        {booking.address.landmark}
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-dashed border-gray-300 shadow-none rounded-md">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Service ID</span>
                  <span className="font-mono text-gray-700 text-right break-all max-w-[60%]">
                    {booking.service.id.slice(0, 12)}...
                  </span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Booking Created
                  </span>
                  <span className="text-gray-700">
                    {formatDate(booking.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Last Updated
                  </span>
                  <span className="text-gray-700">
                    {formatDate(booking.updatedAt)}
                  </span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Service Created
                  </span>
                  <span className="text-gray-700">
                    {formatDate(booking.service.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
