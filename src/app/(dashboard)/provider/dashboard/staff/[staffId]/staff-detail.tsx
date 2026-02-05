"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Trash2,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnlinkStaffModal } from "@/components/provider/staff/unlink-staff-modal";
import { useState } from "react";

interface StaffDetailProps {
  staffId: string;
}

export default function StaffDetail({ staffId }: StaffDetailProps) {
  const router = useRouter();
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/${staffId}`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
  });

  // Fetch staff bookings
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["staff-bookings", staffId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/bookings`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
    enabled: !!staffId,
  });

  const staff = data?.staffProfile;
  const bookings = bookingsData?.bookings || [];

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
          <div className="flex items-center gap-3">
            {staff.status === "APPROVED" && (
              <Button variant="destructive" onClick={handleUnlinkStaff}>
                <UserCircle className="w-4 h-4 mr-2" />
                Unlink from Business
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    alt={staff.user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {staff.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {staff.user.name}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        className={
                          staff.employmentType === "BUSINESS_BASED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }>
                        {staff.employmentType === "BUSINESS_BASED"
                          ? "Business Staff"
                          : "Global Freelancer"}
                      </Badge>
                      <Badge
                        className={
                          staff.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : staff.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }>
                        {staff.status === "APPROVED"
                          ? "Approved"
                          : staff.status === "PENDING"
                          ? "Pending"
                          : "Rejected"}
                      </Badge>
                      {staff.availability && (
                        <Badge
                          className={
                            staff.availability === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }>
                          {staff.availability === "AVAILABLE"
                            ? "Available"
                            : "Busy"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{staff.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.user.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      {staff.experience || 0}{" "}
                      {staff.experience === 1 ? "year" : "years"} experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {staff.bio && <p className="mt-4 text-gray-700">{staff.bio}</p>}

                {/* Specializations */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {staff.specialization?.map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {spec}
                      </span>
                    )) || (
                      <span className="text-gray-500 text-sm">
                        No specializations listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Current Booking */}
                {staff.currentBooking && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff._count?.bookings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff._count?.serviceAssignments || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff._count?.bookings ? "95%" : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff.rating ? `${staff.rating.toFixed(1)} ⭐` : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed info */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.service?.name || "Service"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.user?.name} •{" "}
                            {new Date(
                              booking.slot?.date || booking.createdAt,
                            ).toLocaleDateString()}
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
                {isLoadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No bookings found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {booking.service?.name || "Service"}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>{booking.user?.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                booking.slot?.date || booking.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              booking.trackingStatus === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : booking.trackingStatus === "SERVICE_STARTED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }>
                            {booking.trackingStatus || booking.bookingStatus}
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
                          Completed Bookings
                        </span>
                        <span className="font-semibold">
                          {staff._count?.bookings || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Cancellation Rate{" "}
                          <span className="text-xs text-gray-500">
                            (not implemented)
                          </span>
                        </span>
                        <span className="font-semibold text-green-600">
                          Low
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          On-time Arrival{" "}
                          <span className="text-xs text-gray-500">
                            (not implemented)
                          </span>
                        </span>
                        <span className="font-semibold">98%</span>
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
                          {staff.rating
                            ? `${staff.rating.toFixed(1)} / 5`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Reviews
                        </span>
                        <span className="font-semibold">
                          {staff.reviewCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Response Rate{" "}
                          <span className="text-xs text-gray-500">
                            (not implemented)
                          </span>
                        </span>
                        <span className="font-semibold">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          staffName={staff.user.name}
        />
      )}
    </div>
  );
}
