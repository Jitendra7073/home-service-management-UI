"use client";
import DashboardComponents from "./dashboard";
import { BusinessStatusBanner } from "@/components/provider/BusinessStatusBanner";
import { useUserProfile } from "@/hooks/use-queries";

export default function Dashboard() {
  const { data: user, isLoading } = useUserProfile();
  const business =
    user?.user?.role === "provider" ? user?.user?.businessProfile : null;

  return (
    <>
      {business && (
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <BusinessStatusBanner business={business} />
        </div>
      )}
      <DashboardComponents />
    </>
  );
}
