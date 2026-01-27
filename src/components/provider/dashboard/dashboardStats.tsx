"use client";

import QuickCountCard from "@/components/provider/dashboard/quick-count-card";
import RevenueChart from "@/components/provider/dashboard/revenue-chart";
import BookingStatusChart from "@/components/provider/dashboard/booking-status-chart";
import ServiceChart from "@/components/provider/dashboard/service-chart";
import { Users, ShoppingBag, Wallet, CircleAlert } from "lucide-react";

interface QuickCountsProps {
  data: any;
  plan: any;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: any;
}

const QuickCounts = ({
  data,
  plan,
  isLoading,
  isPending,
  isError,
  error,
}: QuickCountsProps) => {
  const monthlyAnalysis = Array.isArray(data?.monthlyAnalysis)
    ? data.monthlyAnalysis
    : [];

  const totalCustomers =
    typeof data?.totalCustomers === "number" ? data.totalCustomers : 0;

  const totalBookings =
    typeof data?.bookings?.totalBookings === "number"
      ? data.bookings.totalBookings
      : 0;

  const totalEarnings =
    typeof data?.totalEarnings === "number" ? data.totalEarnings : 0;

  const bookingStats = {
    completed: data?.stats?.bookings?.completed ?? 0,
    confirmed: data?.stats?.bookings?.confirmed ?? 0,
    cancelled: data?.stats?.bookings?.cancelled ?? 0,
  };

  const serviceStats = Array.isArray(data?.serviceBookingStats)
    ? data.serviceBookingStats
    : [];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load dashboard stats.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickCountCard
          title={"Total Customers"}
          value={`${totalCustomers}`}
          growth={"Unique customers"}
          icon={Users}
          isLoading={isLoading || isPending}
        />
        <QuickCountCard
          title={"Total Bookings"}
          value={`${totalBookings}`}
          growth={"All time bookings"}
          icon={ShoppingBag}
          isLoading={isLoading || isPending}
        />
        <QuickCountCard
          title={"Total Active Value"}
          value={`₹ ${totalEarnings}`}
          growth={"Realized + Potential"}
          icon={Wallet}
          isLoading={isLoading || isPending}
        />
      </div>

      {/* Middle Row: Revenue & Booking Status */}
      {plan?.name?.toLowerCase().includes("pr") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart
              data={monthlyAnalysis}
              isLoading={isLoading || isPending}
            />
          </div>
          <div className="lg:col-span-1">
            <BookingStatusChart
              data={bookingStats}
              isLoading={isLoading || isPending}
            />
          </div>
        </div>
      )}

      {/* Bottom Row: Service Popularity */}
      <div className="w-full">
        <ServiceChart data={serviceStats} isLoading={isLoading || isPending} />
      </div>

      {!isLoading && !isPending && data?.serviceBookingStats?.length === 0 && (
        <p className="flex justify-start item-center gap-2 text-sm bg-blue-50 text-blue-500 border border-blue-300 rounded py-2 px-4 w-fit">
          <CircleAlert className="w-4 h-4 mt-[0.5px]" />
          No services created yet. Create your first service to start tracking
          analytics.
        </p>
      )}
    </div>
  );
};

export default QuickCounts;
