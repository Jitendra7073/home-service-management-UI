"use client"
import QuickCountCard from "@/components/provider/dashboard/quick-count-card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Users, ShoppingBag, Wallet } from "lucide-react";

export let monthlyAnalysisData: any;
const QuickCounts = (
  { data, isLoading, isPending, isError, error }: {
    data: any,
    isLoading: boolean,
    isPending: boolean,
    isError: boolean,
    error: any
  }
) => {
  console.log("data", data)

  const dashboardStats = [
    {
      title: `Monthly Analytics - ${data?.monthlyAnalysis[0]?.month ?? ''}`,
      value: `₹ ${data?.monthlyAnalysis.length > 0 ? data?.monthlyAnalysis[0].earnings : 0}`,
      growth: `${data?.monthlyAnalysis.length > 0 ? data?.monthlyAnalysis[0].bookings : 0} bookings`,
      icon: BarChart,
      linkText: "View analytics",
    },

    {
      title: "Total Customers",
      value: `${data?.totalCustomers}`,
      growth: "Unique customers",
      icon: Users,
      linkText: "View customers",
    },
    {
      title: "Total Bookings",
      value: `${data?.bookings?.totalBookings}`,
      growth: "All time bookings",
      icon: ShoppingBag,
      linkText: "View bookings",
    }, {
      title: "Total Earnings",
      value: `₹ ${data?.totalEarnings}`,
      growth: "Overall Earnings",
      icon: Wallet,
      linkText: "View details",
    }

  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((item, index) => {
        return (
          <div key={index} className="w-full">
            <QuickCountCard
              title={item.title}
              value={item.value}
              growth={item.growth}
              icon={item.icon}
              linkText={item.linkText}
              isLoading={isLoading || isPending}
            />
          </div>
        );
      })}
    </div>
  );
};

export default QuickCounts;
