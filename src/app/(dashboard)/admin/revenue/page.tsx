"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeIndianRupee,
  TrendingUp,
  CreditCard,
  CalendarCheck,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { PlanCommissionManager } from "@/components/admin/plan-commission-manager";
import AdminRevenueChart from "@/components/admin/admin-revenue-chart";

export default function RevenueDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      // Call Next.js API route (proxy)
      const res = await fetch("/api/admin/revenue");
      if (!res.ok) {
        throw new Error("Failed to fetch revenue stats");
      }
      return res.json();
    },
  });

  if (isLoading) return <RevenueSkeleton />;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load revenue data.</div>;

  const stats = data?.data || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Overview
          </h1>
          <p className="text-muted-foreground">
            Track your platform's revenue, commissions, and subscription
            earnings.
          </p>
        </div>

        {/* TOP CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Platform Fees
              </CardTitle>
              <BadgeIndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(stats.totalCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total platform fees collected from bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription MRR
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(stats.monthlyRecurringRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Est. Monthly Recurring Revenue from {stats.activeSubscriptions}{" "}
                active plans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">
                {stats.totalBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all services
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED SECTIONS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Comparing Platform Fees vs Subscription Revenue.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AdminRevenueChart
                data={stats.revenueBreakdown}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
              <CardDescription>Platform health metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-medium">
                    Avg. Platform Fee per Booking
                  </span>
                  <span className="font-bold">
                    {stats.totalBookings > 0
                      ? formatCurrency(
                          stats.totalCommission / stats.totalBookings,
                        )
                      : "₹0"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-medium">
                    Avg. Subscription Value
                  </span>
                  <span className="font-bold">
                    {stats.activeSubscriptions > 0
                      ? formatCurrency(
                          stats.monthlyRecurringRevenue /
                            stats.activeSubscriptions,
                        )
                      : "₹0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Active Paying Providers
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">
                      {stats.activeSubscriptions}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COMMISSION SETTINGS */}
        <div className="mt-6">
          <PlanCommissionManager />
        </div>
      </div>
    </div>
  );
}

function RevenueSkeleton() {
  return (
    <div className="w-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-64" />
          <Skeleton className="col-span-3 h-64" />
        </div>
      </div>
    </div>
  );
}
