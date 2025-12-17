"use client";

import QuickCountCard from "@/components/provider/dashboard/quick-count-card";
import { BarChart, Users, ShoppingBag, Wallet, CircleAlert } from "lucide-react";

interface QuickCountsProps {
  data: any;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: any;
}

const QuickCounts = ({
  data,
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

  const dashboardStats = [
    {
      title: `Monthly Analytics - ${currentMonthAnalysis?.month ?? "N/A"}`,
      value: `₹ ${currentMonthAnalysis?.earnings ?? 0}`,
      growth: `${currentMonthAnalysis?.bookings ?? 0} bookings`,
      icon: BarChart,
    },
    {
      title: "Total Customers",
      value: `${totalCustomers}`,
      growth: "Unique customers",
      icon: Users,
    },
    {
      title: "Total Bookings",
      value: `${totalBookings}`,
      growth: "All time bookings",
      icon: ShoppingBag,
    },
    {
      title: "Total Earnings",
      value: `₹ ${totalEarnings}`,
      growth: "Overall Earnings",
      icon: Wallet,
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load dashboard stats.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((item, index) => (
          <div key={index} className="w-full">
            <QuickCountCard
              title={item.title}
              value={item.value}
              growth={item.growth}
              icon={item.icon}
              isLoading={isLoading || isPending}
            />
          </div>
        ))}
      </div>

      {!isLoading && !isPending && monthlyAnalysis.length === 0 && (
        <p
          className="flex  justify-start item-center gap-2 text-sm bg-blue-50 text-blue-500 border border-blue-300 rounded py-1 px-3 w-fit">
          <CircleAlert className="w-4 h-4 mt-[0.5px]"/>No services created yet. Create your first service to start tracking
          analytics.
        </p>
      )}
    </div>
  );
};

export default QuickCounts;
