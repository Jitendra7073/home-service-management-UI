import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Fixora",
  description: "Manage your Everything in Fixora.",
};

export default function AdminDashboard() {
  return <DashboardClient />;
}
