"use client";

import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  date: string;
  slot?: {
    time: string;
  };
  service: {
    name: string;
    price: number;
  };
  user: {
    name: string;
    mobile: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    landmark?: string;
    addressType?: string;
  };
  bookingStatus: string;
}

interface StaffBookingsListProps {
  bookings: Booking[];
}

export default function StaffBookingsList({
  bookings,
}: StaffBookingsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
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
    });
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => (window.location.href = `/staff/bookings/${booking.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getStatusColor(booking.bookingStatus)}>
                  {booking.bookingStatus.replace(/_/g, " ")}
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

              {/* Service Name */}
              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                {booking.service.name}
              </h4>

              {/* Customer Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{booking.user.name}</span>
                  <span>•</span>
                  <span>{booking.user.mobile}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-words">
                    {booking.address ? (
                      <>
                        {booking.address.street}
                        {booking.address.landmark && ` (Landmark: ${booking.address.landmark})`}
                        <br />
                        {booking.address.city}, {booking.address.state} {booking.address.postalCode || ""}
                      </>
                    ) : (
                      "Address not provided"
                    )}
                  </span>
                </div>
              </div>

              {/* Price */}
              <p className="text-lg font-semibold text-gray-900">
                ${booking.service.price}
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
