import { ServiceManagement } from "@/components/admin/services/ServiceManagement";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Manage All Services in HomHelpers.",
};

export default function AdminServicesPage() {
  return <ServiceManagement />;
}
