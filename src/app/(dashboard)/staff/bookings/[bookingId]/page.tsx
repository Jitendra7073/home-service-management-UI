"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default function StaffBookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["staff-booking", resolvedParams.bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/staff/bookings`);
      const result = await res.json();
      // Find the specific booking from the list
      return result.bookings?.find(
        (b: any) => b.id === resolvedParams.bookingId,
      );
    },
    enabled: !!resolvedParams.bookingId,
  });

  const booking = data;

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusUpdate = async (status: "IN_PROGRESS" | "COMPLETED") => {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/staff/booking/${resolvedParams.bookingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, notes }),
        },
      );

      const result = await res.json();

      if (result.success) {
        toast.success(`Booking marked as ${status.toLowerCase()}`);
        window.location.reload();
      } else {
        toast.error(result.msg || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex w-full justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl px-4 py-8">
          <p className="text-gray-600">Booking not found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Bookings
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div>
            <Badge
              variant="outline"
              className={`text-sm px-4 py-2 ${getStatusColor(
                booking.bookingStatus,
              )}  `}>
              {booking.bookingStatus.replace(/_/g, " ")}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Booking ID: {booking.id.slice(0, 8)}...
          </p>
        </div>

        {/* Booking Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {booking.service.name}
              </h3>
              <p className="text-gray-600">{booking.service.description}</p>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>{formatDate(booking.date)}</span>
              </div>
              {booking.slot && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{booking.slot.time}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">${booking.service.price}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Customer Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{booking.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{booking.user.mobile}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Service Location
              </h4>
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>
                  {booking.address.street}, {booking.address.city},{" "}
                  {booking.address.state} {booking.address.postalCode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              {booking.bookingStatus === "CONFIRMED" && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                    disabled={isUpdating}
                    className="flex-1">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Mark In Progress
                      </>
                    )}
                  </Button>
                </>
              )}

              {booking.bookingStatus === "IN_PROGRESS" && (
                <Button
                  onClick={() => handleStatusUpdate("COMPLETED")}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700">
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}

              {booking.bookingStatus === "COMPLETED" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Booking completed!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
