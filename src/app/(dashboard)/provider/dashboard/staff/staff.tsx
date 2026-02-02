"use client";

import { useQuery } from "@tanstack/react-query";
import StaffTable from "@/components/provider/staff/staff-table";
import BookingHeader from "@/components/provider/header";
import StaffStatsCards from "@/components/provider/staff/staff-stats-cards";
import { StaffProfile } from "@/lib/api/staff";

export default function StaffView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch("/api/provider/staff", {
        method: "GET",
      });
      return res.json();
    },
  });

  if (isLoading) {
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

  const staffProfiles = data?.staffProfiles || [];

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-8 md:space-y-14">
        <BookingHeader
          title="Staff"
          description="Manage your staff members, their service assignments, and availability"
          isVisibleAddStaffButton
        />
        <StaffStatsCards
          total={staffProfiles.length}
          active={staffProfiles.filter((s: StaffProfile) => s.isActive).length}
          businessBased={staffProfiles.filter(
            (s: StaffProfile) => s.employmentType === "BUSINESS_BASED"
          ).length}
          globalFreelance={staffProfiles.filter(
            (s: StaffProfile) => s.employmentType === "GLOBAL_FREELANCE"
          ).length}
          isLoading={isLoading}
        />
        <StaffTable NumberOfRows={10} />
      </div>
    </div>
  );
}
