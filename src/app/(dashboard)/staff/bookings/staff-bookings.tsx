"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Filter, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StaffBookings() {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["staff-bookings", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL")
        params.append("status", statusFilter);

      const res = await fetch(`/api/staff/bookings?${params}`);
      return res.json();
    },
  });

  const bookings = data?.bookings || [];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Circle className="w-4 h-4 text-yellow-600" />;
      case "CONFIRMED":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-purple-600" />;
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
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
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            View and manage your assigned bookings
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Bookings</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={getStatusColor(booking.bookingStatus)}
                      variant="outline">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.bookingStatus)}
                        {booking.bookingStatus.replace(/_/g, " ")}
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
                        {booking.service.description}
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
                        {booking.address.street}, {booking.address.city},{" "}
                        {booking.address.state}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        ${booking.service.price}
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
              {statusFilter
                ? "Try changing the status filter"
                : "You don't have any assigned bookings yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
