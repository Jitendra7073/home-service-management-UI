"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StaffStatsCards from "@/components/staff/staff-stats-cards";
import StaffBookingsList from "@/components/staff/staff-bookings-list";
import Link from "next/link";

export default function StaffDashboard() {
  // Fetch user profile
  const { data: profileData } = useQuery({
    queryKey: ["staff-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
  });

  const user = profileData?.user;

  // Fetch staff dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["staff-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/staff/dashboard/stats");
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch upcoming bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["staff-bookings", "upcoming"],
    queryFn: async () => {
      const res = await fetch("/api/staff/bookings?status=CONFIRMED&limit=5");
      return res.json();
    },
    enabled: !!user,
  });

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-7xl px-2 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "Staff"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your assignments and earnings
          </p>
        </div>

        {/* Stats Cards */}
        {stats?.stats && (
          <StaffStatsCards stats={stats.stats} isLoading={statsLoading} />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Assignments
                  </h2>
                  <Link
                    href="/staff/bookings"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer hover:underline">
                    View All <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>

                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-gray-200 animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : bookings?.bookings?.length > 0 ? (
                  <StaffBookingsList bookings={bookings.bookings} />
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming assignments</p>
                    <p className="text-sm text-gray-500 mt-2">
                      You'll see your assigned bookings here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Earnings Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Total Earnings
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{stats?.stats?.totalEarnings || 0}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ₹{stats?.stats?.pendingPayments || 0} pending
                </p>
                <Link
                  href="/staff/earnings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-flex items-center hover:underline">
                  View Earnings <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href="/staff/bookings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">View All Bookings</span>
                  </a>
                  <a
                    href="/staff/earnings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <IndianRupee className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">View Earnings</span>
                  </a>
                  <a
                    href="/staff/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Update Profile</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
