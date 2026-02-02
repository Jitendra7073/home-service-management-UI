import ProviderApplications from "./provider-applications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Applications - Provider",
  description: "Review and respond to staff applications",
};

export default function ProviderApplicationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <ProviderApplications />
    </div>
  );
}
