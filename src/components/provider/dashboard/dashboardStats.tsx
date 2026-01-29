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

  // Check if subscription is active or trialing (covers scheduled cancellation)
  const subscriptionStatus = data?.user?.providerSubscription?.status;
  const isPlanActive =
    subscriptionStatus == "active" || subscriptionStatus == "trialing";

  const showRevenueChart =
    isPlanActive && plan?.features?.allowedGraphs?.includes("revenue_chart");

  const showBookingStatusChart =
    isPlanActive &&
    plan?.features?.allowedGraphs?.includes("bookings_status_chart");

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
        {isPlanActive &&
          plan?.features?.allowedRoutes?.includes("total_customers") && (
            <QuickCountCard
              title={"Total Customers"}
              value={`${totalCustomers}`}
              growth={"Unique customers"}
              icon={Users}
              isLoading={isLoading || isPending}
            />
          )}
        {isPlanActive &&
          plan?.features?.allowedRoutes?.includes("total_bookings") && (
            <QuickCountCard
              title={"Total Bookings"}
              value={`${totalBookings}`}
              growth={"All time bookings"}
              icon={ShoppingBag}
              isLoading={isLoading || isPending}
            />
          )}
        {isPlanActive &&
          plan?.features?.allowedRoutes?.includes("total_revenue") && (
            <QuickCountCard
              title={"Total Active Value"}
              value={`₹ ${totalEarnings}`}
              growth={"Realized + Potential"}
              icon={Wallet}
              isLoading={isLoading || isPending}
            />
          )}
      </div>

      {/* Middle Row: Revenue & Booking Status */}
      <div
        className={`grid gap-6 ${
          !showRevenueChart && !showBookingStatusChart
            ? "hidden"
            : showRevenueChart && showBookingStatusChart
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1"
        }`}>
        {showRevenueChart && (
          <div
            className={
              showBookingStatusChart ? "lg:col-span-2" : "lg:col-span-3"
            }>
            <RevenueChart
              data={monthlyAnalysis}
              isLoading={isLoading || isPending}
            />
          </div>
        )}
        {showBookingStatusChart && (
          <div className="lg:col-span-1">
            <BookingStatusChart
              data={bookingStats}
              isLoading={isLoading || isPending}
            />
          </div>
        )}
      </div>

      {/* Bottom Row: Service Popularity */}
      <div className="w-full">
        {isPlanActive &&
          plan?.features?.allowedGraphs?.includes("popular_services_chart") && (
            <ServiceChart
              data={serviceStats}
              isLoading={isLoading || isPending}
            />
          )}
      </div>
    </div>
  );
};

export default QuickCounts;
