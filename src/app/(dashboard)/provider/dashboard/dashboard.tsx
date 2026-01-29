"use client";

import { BookingTable } from "@/components/provider/dashboard/booking-table";
import FeedbackTable from "@/components/provider/dashboard/customer-feedback-table";
import QuickCounts from "@/components/provider/dashboard/dashboardStats";
import ServicesTable from "@/components/provider/dashboard/services-table";
import Welcome from "@/components/provider/dashboard/welcome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DashboardSkeleton from "@/components/provider/dashboard/DashboardSkeleton";
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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

  // Check if subscription is active or trialing (covers scheduled cancellation)
  const subscriptionStatus = data?.user?.providerSubscription?.status;
  const isPlanActive =
    subscriptionStatus == "active" || subscriptionStatus == "trialing";
  const showServices =
    isPlanActive && plans?.features?.allowedRoutes?.includes("all_services");

  const showFeedback =
    isPlanActive &&
    plans?.features?.allowedRoutes?.includes("customer_feedback");

  return (
    <div className="w-full min-h-screen bg-background">
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto md:px-6 py-6 md:py-8 space-y-8">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border bg-card rounded-xl p-2 shadow-sm">
          {/* LEFT SIDE */}
          <Welcome
            username={data?.user?.name}
            isLoading={isLoading}
            isPending={isPending}
          />

          {/* RIGHT SIDE ICON ACTIONS */}
          <div className="flex items-center justify-end gap-2 px-6 md:px-4 pb-4 md:pb-0">
            <div className="h-9 flex items-center">
              <BusinessVisibilityToggle
                business={data?.user?.businessProfile}
                onUpdate={handleStatusUpdate}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleGlobalRefresh}
              disabled={isRefreshing || isLoading}
              title="Refresh Dashboard"
              className="h-9 w-9 bg-transparent border-input hover:bg-accent hover:text-accent-foreground transition-colors">
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div>
          <QuickCounts
            data={data}
            plan={plans}
            isLoading={isLoading}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </div>

        {/* TABLES SECTION */}
        <section className="space-y-8">
          {/* TOP GRID TABLES */}
          <div
            className={`grid gap-6 ${
              !showServices && !showFeedback
                ? "hidden"
                : showServices && showFeedback
                ? "grid-cols-1 xl:grid-cols-2"
                : "grid-cols-1"
            }`}>
            {showServices && <ServicesTable />}

            {showFeedback && <FeedbackTable />}
          </div>

          {/* FULL WIDTH BOOKINGS */}
          {isPlanActive &&
            plans?.features?.allowedRoutes?.includes("booking_list") && (
              <BookingTable />
            )}

          {/* EMPTY STATE */}
          {!isPlanActive && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-12 text-center">
              <h3 className="text-lg font-semibold">
                No Dashboard Data Available
              </h3>

              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Your current subscription does not include dashboard features.
                Upgrade your plan to unlock analytics and management tools.
              </p>

              <Button className="mt-4">Upgrade Plan</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardComponents;
