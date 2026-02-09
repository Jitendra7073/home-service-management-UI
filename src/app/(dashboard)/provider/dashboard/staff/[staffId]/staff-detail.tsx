"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Star,
  Clock,
  CheckCircle2,
  Loader2,
  UserCircle,
  ToggleLeft,
  ToggleRight,
  CalendarClock,
  FileText,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnlinkStaffModal } from "@/components/provider/staff/unlink-staff-modal";
import { useState } from "react";
import { toast } from "sonner";
import { StaffLeaveManagement } from "./staff-leave-management";

interface StaffDetailProps {
  staffId: string;
}

export default function StaffDetail({ staffId }: StaffDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/staff/${staffId}/details`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.msg || "Failed to fetch staff details");
      }
      return res.json();
    },
  });

  // Mutation to update staff availability
  const updateAvailabilityMutation = useMutation({
    mutationFn: async (availability: "AVAILABLE" | "BUSY") => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/availability`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ availability }),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Staff availability updated successfully");
        queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      } else {
        toast.error(data.msg || "Failed to update availability");
      }
    },
    onError: () => {
      toast.error("Failed to update availability");
    },
  });

  // Mutation to update staff application status
  const updateStatusMutation = useMutation({
    mutationFn: async (status: "APPROVED" | "REJECTED") => {
      const res = await fetch(`/api/provider/staff/${staffId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update status");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = () => updateStatusMutation.mutate("APPROVED");
  const handleReject = () => updateStatusMutation.mutate("REJECTED");

  const handleToggleAvailability = () => {
    const newAvailability =
      staff?.availability === "AVAILABLE" ? "BUSY" : "AVAILABLE";
    updateAvailabilityMutation.mutate(newAvailability);
  };

  const staff = data?.staff;
  const recentActivity = staff?.recentActivity || [];
  const bookingHistory = staff?.bookingHistory || [];
  const performance = staff?.performance || {};

  if (isLoading) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8">
          <p className="text-gray-600">Staff member not found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleUnlinkStaff = () => {
    setShowUnlinkModal(true);
  };

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </button>
          {staff.applicationStatus !== "PENDING" && (
            <div className="flex items-center gap-3">
              <Button variant="destructive" onClick={handleUnlinkStaff}>
                <UserCircle className="w-4 h-4 mr-2" />
                Unlink from Business
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-md bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {staff.name}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-purple-100 text-purple-700">
                        Business Staff
                      </Badge>
                      {staff.applicationStatus === "PENDING" ? (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Pending Approval
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          Approved
                        </Badge>
                      )}
                      {staff.availability === "NOT_AVAILABLE" &&
                      staff.leaveDetails ? (
                        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-sm bg-red-600 animate-pulse"></span>
                          On Leave
                        </Badge>
                      ) : staff.availability === "ON_WORK" ? (
                        <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-sm bg-blue-600 animate-pulse"></span>
                          On Work
                        </Badge>
                      ) : staff.availability === "BUSY" ? (
                        <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-sm bg-orange-600 animate-pulse"></span>
                          Busy
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-sm bg-green-600"></span>
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Availability Toggle Removed - Provider cannot change staff availability */}
                  <div className="flex items-center gap-3">
                    {/* Placeholder or nothing */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      Joined {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Current Booking */}
                {staff.currentBooking && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-sm">
                    <div className="flex items-center gap-2 text-orange-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Currently on service:
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      {staff.currentBooking.service} for{" "}
                      {staff.currentBooking.customer}
                      {staff.currentBooking.time &&
                        ` at ${staff.currentBooking.time}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-sm">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance.totalBookings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-sm">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance.completedBookings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance.completionRate || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-sm">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performance.averageRating
                      ? `${performance.averageRating.toFixed(1)} ⭐`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed info */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 10).map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-sm hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.service?.name || "Service"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.user?.name} •{" "}
                            {new Date(booking.date).toLocaleDateString()}{" "}
                            {booking.slot?.time && `at ${booking.slot.time}`}
                          </p>
                        </div>
                        <Badge
                          className={
                            booking.bookingStatus === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : booking.bookingStatus === "CONFIRMED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }>
                          {booking.bookingStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No bookings found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookingHistory.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-sm hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {booking.service?.name || "Service"}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>{booking.user?.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(booking.date).toLocaleDateString()}
                              {booking.slot?.time && ` at ${booking.slot.time}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              booking.bookingStatus === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : booking.trackingStatus === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : booking.trackingStatus === "SERVICE_STARTED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }>
                            {booking.bookingStatus === "CANCELLED"
                              ? "Cancelled"
                              : booking.trackingStatus || booking.bookingStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Completion Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Bookings
                        </span>
                        <span className="font-semibold">
                          {performance.totalBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Completed Bookings
                        </span>
                        <span className="font-semibold">
                          {performance.completedBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Pending Bookings
                        </span>
                        <span className="font-semibold">
                          {performance.pendingBookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Completion Rate
                        </span>
                        <span className="font-semibold text-green-600">
                          {performance.completionRate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Performance Score
                        </span>
                        <span className="font-semibold">
                          {performance.performanceScore || 0}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Customer Feedback
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Average Rating
                        </span>
                        <span className="font-semibold">
                          {performance.averageRating || 0} / 5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Reviews
                        </span>
                        <span className="font-semibold">
                          {performance.feedbackCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Earnings
                        </span>
                        <span className="font-semibold">
                          ₹{performance.totalEarnings || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="mt-6">
            <StaffLeaveManagement staffId={staffId} />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() =>
              router.push(`/provider/dashboard/staff/${staffId}/assignments`)
            }>
            <Briefcase className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Manage Services</p>
              <p className="text-sm text-gray-600">
                Assign or remove services for this staff member
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => router.push(`/provider/dashboard/bookings`)}>
            <Calendar className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">View All Bookings</p>
              <p className="text-sm text-gray-600">
                See all bookings assigned to this staff member
              </p>
            </div>
          </Button>
        </div>
      </div>

      {/* Unlink Staff Modal */}
      {showUnlinkModal && (
        <UnlinkStaffModal
          isOpen={showUnlinkModal}
          onClose={() => setShowUnlinkModal(false)}
          staffId={staffId}
          staffName={staff.name}
        />
      )}
    </div>
  );
}
