import { BusinessManagement } from "@/components/admin/businesses/BusinessManagement";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business",
  description: "Manage All Business in HomHelpers.",
};

export default function AdminBusinessesPage() {
  return <BusinessManagement />;
}
