"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, CheckCircle2, Circle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaffBookingsSkeleton } from "@/components/staff/skeletons";
import { StaffProfileCompletionAlert } from "@/components/staff/profile-completion-alert";

type TabType = "all" | "upcoming" | "ongoing" | "completed" | "cancelled";

export default function StaffBookings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as TabType | null;

  // Initialize activeTab from URL or default to "all"
  const [activeTab, setActiveTab] = useState<TabType>(
    (statusParam === "upcoming" || statusParam === "ongoing" || statusParam === "completed" || statusParam === "cancelled")
      ? statusParam
      : "all"
  );

  // Update URL when tab changes
  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "all") {
      params.delete("status");
    } else {
      params.set("status", newTab);
    }

    // Update URL without refreshing
    router.push(`/staff/bookings?${params.toString()}`, { scroll: false });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["staff-bookings", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") {
        params.append("status", activeTab);
      }

      const res = await fetch(`/api/staff/bookings?${params}`, {
        credentials: "include",
      });
      return res.json();
    },
  });

  const bookings = data?.bookings || [];

  // Show skeleton while loading
  if (isLoading) {
    return <StaffBookingsSkeleton />;
  }

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: "all", label: "All Bookings", icon: Calendar },
    { key: "upcoming", label: "Upcoming", icon: Calendar },
    { key: "ongoing", label: "Ongoing", icon: Clock },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
    { key: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  const getTrackingStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-700";
      case "BOOKING_STARTED":
        return "bg-blue-100 text-blue-700";
      case "PROVIDER_ON_THE_WAY":
        return "bg-yellow-100 text-yellow-700";
      case "SERVICE_STARTED":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return null;
    }
  };

  const getBookingStatusIcon = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getBookingStatusLabel = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "Cancelled by Customer";
      default:
        return null;
    }
  };

  const getTrackingStatusIcon = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return <Circle className="w-4 h-4 text-gray-600" />;
      case "BOOKING_STARTED":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "PROVIDER_ON_THE_WAY":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "SERVICE_STARTED":
        return <Circle className="w-4 h-4 text-purple-600" />;
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrackingStatusLabel = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "Not Started";
      case "BOOKING_STARTED":
        return "Start Service";
      case "PROVIDER_ON_THE_WAY":
        return "On the Way";
      case "SERVICE_STARTED":
        return "Service Started";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <StaffProfileCompletionAlert />
      <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          View and manage your assigned bookings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                (window.location.href = `/staff/bookings/${booking.id}`)
              }>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Status & Date */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Badge
                      className={
                        getBookingStatusColor(booking.bookingStatus) ||
                        getTrackingStatusColor(booking.trackingStatus)
                      }
                      variant="outline">
                      <div className="flex items-center gap-2">
                        {getBookingStatusIcon(booking.bookingStatus) ||
                          getTrackingStatusIcon(booking.trackingStatus)}
                        {getBookingStatusLabel(booking.bookingStatus) ||
                          getTrackingStatusLabel(booking.trackingStatus)}
                      </div>
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {formatDate(booking.date)}
                    </span>
                    {booking.slot && (
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.slot.time}
                      </span>
                    )}
                  </div>

                  {/* Service & Customer */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {booking.service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.businessProfile.businessName}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Customer:</span>
                        <span>{booking.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Phone:</span>
                        <span>{booking.user.mobile}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="font-medium">Location:</span>
                      <span>
                        {booking.address?.street}, {booking.address?.city},{" "}
                        {booking.address?.state}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No bookings found
            </p>
            <p className="text-gray-500 text-sm">
              {activeTab !== "all"
                ? `No ${activeTab} bookings found`
                : "You don't have any assigned bookings yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </>
  );
}
