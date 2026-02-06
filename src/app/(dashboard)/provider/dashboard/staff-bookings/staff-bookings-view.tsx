"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, MapPin, Filter, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type TrackingStatus = "NOT_STARTED" | "BOOKING_STARTED" | "PROVIDER_ON_THE_WAY" | "SERVICE_STARTED" | "COMPLETED";

interface StaffBooking {
  id: string;
  date: string;
  slot?: {
    time: string;
  };
  service: {
    name: string;
    price: number;
    durationInMinutes: number;
  };
  user: {
    name: string;
    mobile: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
  };
  bookingStatus: BookingStatus;
  trackingStatus: TrackingStatus;
  businessProfile: {
    businessName: string;
  };
  StaffAssignBooking: Array<{
    assignedStaff: {
      id: string;
      name: string;
    };
    status: string;
  }>;
}

export default function StaffBookingsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trackingFilter, setTrackingFilter] = useState<string>("all");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["provider-staff-bookings", statusFilter, trackingFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("bookingStatus", statusFilter);
      if (trackingFilter !== "all") params.append("trackingStatus", trackingFilter);

      const response = await fetch(`/api/provider/staff-bookings?${params}`, {
        credentials: "include",
      });
      return response.json();
    },
  });

  const bookings: StaffBooking[] = data?.bookings || [];

  const getBookingStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrackingStatusColor = (status: TrackingStatus) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTrackingStatus = (status: string) => {
    return status?.replaceAll("_", " ") || "Not Started";
  };

  return (
    <div className="w-full max-w-7xl px-4 py-8 mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Bookings</h1>
          <p className="text-gray-600 mt-2">
            View all bookings assigned to your staff members
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh bookings">
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Booking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={trackingFilter} onValueChange={setTrackingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tracking Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracking</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="BOOKING_STARTED">Booking Started</SelectItem>
                <SelectItem value="PROVIDER_ON_THE_WAY">On The Way</SelectItem>
                <SelectItem value="SERVICE_STARTED">Service Started</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const assignedStaff = booking.StaffAssignBooking?.[0]?.assignedStaff;
            return (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href={`/provider/dashboard/bookings/${booking.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Status & Date */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <Badge className={getBookingStatusColor(booking.bookingStatus)}>
                            {booking.bookingStatus}
                          </Badge>
                          <Badge className={getTrackingStatusColor(booking.trackingStatus)}>
                            {formatTrackingStatus(booking.trackingStatus)}
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
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Customer:</span>
                              <span>{booking.user.name}</span>
                              <span>•</span>
                              <span>{booking.user.mobile}</span>
                            </div>
                            {assignedStaff && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">Staff:</span>
                                <span className="text-blue-700">{assignedStaff.name}</span>
                              </div>
                            )}
                          </div>

                          {/* Location */}
                          {booking.address && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                              <span className="break-words">
                                {booking.address.street}, {booking.address.city}, {booking.address.state}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{booking.service.price}
                          </p>
                          <div className="text-sm text-gray-500">
                            {booking.service.durationInMinutes} minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              No staff bookings found
            </p>
            <p className="text-gray-500 text-sm">
              {statusFilter !== "all" || trackingFilter !== "all"
                ? "Try adjusting your filters"
                : "Staff bookings will appear here once you assign staff to bookings"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
