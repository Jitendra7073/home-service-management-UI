"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StaffTable from "@/components/provider/staff/staff-table";
import PendingStaffRequests from "@/components/provider/staff/pending-staff-requests";
import BookingHeader from "@/components/provider/header";
import StaffStatsCards from "@/components/provider/staff/staff-stats-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaffProfile {
  id: string;
  status: string;
  isActive: boolean;
  employmentType: string;
}

type TabValue = "all-staff" | "pending-requests";

export default function StaffView() {
  const [activeTab, setActiveTab] = useState<TabValue>("all-staff");

  // Fetch all staff data
  const { data: allStaffData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff`, {
        credentials: "include",
        method: "GET",
      });
      return res.json();
    },
  });

  // Fetch pending staff requests
  const { data: pendingData, isLoading: isLoadingPending } = useQuery({
    queryKey: ["staff", "pending"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff?isApproved=false`, {
        credentials: "include",
        method: "GET",
      });
      return res.json();
    },
  });

  const allStaffProfiles = allStaffData?.staffProfiles || [];
  const pendingRequests = pendingData?.staffProfiles?.filter((s: StaffProfile) => s.status === "PENDING") || [];
  const pendingCount = pendingRequests.length;

  if (isLoadingAll) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-8 md:space-y-14">
          <BookingHeader
            title="Staff"
            description="Manage your staff members and their assignments"
          />
          <div className="space-y-6">
            {/* Skeleton cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-8 md:space-y-14">
        <BookingHeader
          title="Staff"
          description="Manage your staff members, their service assignments, and availability"
        />
        <StaffStatsCards
          total={allStaffProfiles.length}
          active={allStaffProfiles.filter((s: StaffProfile) => s.isActive).length}
          businessBased={
            allStaffProfiles.filter(
              (s: StaffProfile) => s.employmentType === "BUSINESS_BASED",
            ).length
          }
          globalFreelance={
            allStaffProfiles.filter(
              (s: StaffProfile) => s.employmentType === "GLOBAL_FREELANCE",
            ).length
          }
          isLoading={isLoadingAll}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all-staff">
              All Staff ({allStaffProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="pending-requests" className="relative">
              Pending Requests
              {pendingCount > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-staff" className="mt-6">
            <StaffTable NumberOfRows={10} />
          </TabsContent>

          <TabsContent value="pending-requests" className="mt-6">
            <PendingStaffRequests isLoading={isLoadingPending} requests={pendingRequests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
