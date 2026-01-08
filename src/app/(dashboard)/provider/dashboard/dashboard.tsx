"use client";

import { BookingTable } from "@/components/provider/dashboard/booking-table";
import FeedbackTable from "@/components/provider/dashboard/customer-feedback-table";
import QuickCounts from "@/components/provider/dashboard/dashboardStats";
import RevenueChart from "@/components/provider/dashboard/revenue-chart";
import ServiceChart from "@/components/provider/dashboard/service-chart";
import ServicesTable from "@/components/provider/dashboard/services-table";
import Welcome from "@/components/provider/dashboard/welcome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BusinessVisibilityToggle } from "@/components/provider/dashboard/BusinessVisibilityToggle";

const DashboardComponents = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, isPending, isError, error, refetch } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/provider/dashboard", { cache: "no-store" });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const subscriptionstate =
    data?.user?.providerSubscription !== null
      ? data?.user?.providerSubscription
      : {};

  const plans = subscriptionstate !== null ? subscriptionstate?.plan : {};

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch all queries
      await queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await refetch();
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleStatusUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["common", "profile"] });

    queryClient.setQueryData(["common", "profile"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        user: {
          ...oldData.user,
          businessProfile: {
            ...oldData.user.businessProfile,
            isActive: !oldData.user.businessProfile.isActive,
          },
        },
      };
    });

    queryClient.setQueryData(["dashboard-stats"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        user: {
          ...oldData.user,
          businessProfile: {
            ...oldData.user.businessProfile,
            isActive: !oldData.user.businessProfile.isActive,
          },
        },
      };
    });
  };

  return (
    <div className="flex w-full justify-center pb-10">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6 space-y-10 md:space-y-14">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center">
          <Welcome
            username={data?.user.name}
            isLoading={isLoading}
            isPending={isPending}
          />
          <div className="absolute top-4 right-18 flex items-center gap-2">
            <BusinessVisibilityToggle
              business={data?.user?.businessProfile}
              onUpdate={handleStatusUpdate}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleGlobalRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2 border-none shadow-none"
              title="Refresh all dashboard data">
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {["premimum", "pro"].some((keyword) =>
          plans?.name?.toLowerCase().includes(keyword)
        ) && (
          <QuickCounts
            data={data}
            plan={plans}
            isLoading={isLoading}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        )}

        <section
          className={`${
            plans?.name?.toLowerCase() === "pro" &&
            "grid grid-cols-1 md:grid-cols-2 gap-6"
          }`}>
          {["premimum", "pro"].some((keyword) =>
            plans?.name?.toLowerCase().includes(keyword)
          ) && (
            <RevenueChart
              data={data?.monthlyAnalysis || []}
              isLoading={isLoading || isPending}
            />
          )}
          {["pro"].some((keyword) =>
            plans?.name?.toLowerCase().includes(keyword)
          ) && (
            <ServiceChart
              data={data?.serviceBookingStats || []}
              isLoading={isLoading || isPending}
            />
          )}
        </section>

        {["premimum", "pro"].some((keyword) =>
          plans?.name?.toLowerCase().includes(keyword)
        ) && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ServicesTable />
              <FeedbackTable />
            </div>
          </section>
        )}

        <section className="mb-10">
          {["premimum", "pro"].some((keyword) =>
            plans?.name?.toLowerCase().includes(keyword)
          ) ? (
            <section className="space-y-6">
              <BookingTable />
            </section>
          ) : (
            <ServicesTable />
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardComponents;
