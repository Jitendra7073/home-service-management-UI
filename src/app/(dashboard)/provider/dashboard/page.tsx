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
        <div className="max-w-7xl mx-auto md:px-6 transition-all">
          <BusinessStatusBanner
            business={business}
            plan={user?.user?.providerSubscription?.plan}
          />
        </div>
      )}
      <DashboardComponents />
    </>
  );
}
