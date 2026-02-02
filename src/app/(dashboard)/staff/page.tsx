import StaffDashboard from "./staff-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Dashboard",
  description: "Manage your assignments and view your earnings",
};

export default function StaffHomePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffDashboard />
    </div>
  );
}
