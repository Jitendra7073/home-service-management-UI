"use client";

import QuickCountCard from "@/components/provider/dashboard/quick-count-card";
import {
  BarChart,
  Users,
  ShoppingBag,
  Wallet,
  CircleAlert,
} from "lucide-react";

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

  const currentMonthAnalysis =
    monthlyAnalysis.length > 0 ? monthlyAnalysis[0] : null;

  const totalCustomers =
    typeof data?.totalCustomers === "number" ? data.totalCustomers : 0;

  const totalBookings =
    typeof data?.bookings?.totalBookings === "number"
      ? data.bookings.totalBookings
      : 0;

  const totalEarnings =
    typeof data?.totalEarnings === "number" ? data.totalEarnings : 0;

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load dashboard stats.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${plan?.name.toLowerCase() === "pro" ? "lg:grid-cols-4" :" lg:grid-cols-3"}  gap-6`}>
       {plan?.name.toLowerCase() === "pro" &&  <QuickCountCard
          title={`Monthly Analytics - ${currentMonthAnalysis?.month ?? "N/A"}`}
          value={`₹ ${currentMonthAnalysis?.earnings ?? 0}`}
          growth={`${currentMonthAnalysis?.bookings ?? 0} bookings`}
          icon={BarChart}
          isLoading={isLoading || isPending}
        />}
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
          title={"Total Earnings"}
          value={`₹ ${totalEarnings}`}
          growth={"Overall Earnings"}
          icon={Wallet}
          isLoading={isLoading || isPending}
        />
      </div>

      {!isLoading && !isPending && data?.serviceBookingStats.length === 0 && (
        <p className="flex  justify-start item-center gap-2 text-sm bg-blue-50 text-blue-500 border border-blue-300 rounded py-1 px-3 w-fit">
          <CircleAlert className="w-4 h-4 mt-[0.5px]" />
          No services created yet. Create your first service to start tracking
          analytics.
        </p>
      )}
    </div>
  );
};

export default QuickCounts;
