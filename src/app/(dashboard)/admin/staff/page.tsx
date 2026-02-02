import AdminStaffOverview from "./admin-staff-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management - Admin",
  description: "Platform-wide staff oversight and management",
};

export default function AdminStaffPage() {
  return <AdminStaffOverview />;
}
