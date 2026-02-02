import StaffApplications from "./staff-applications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications - Staff",
  description: "View your business application status",
};

export default function StaffApplicationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffApplications />
    </div>
  );
}
