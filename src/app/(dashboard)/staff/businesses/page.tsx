import StaffBusinessBrowser from "./staff-business-browser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Businesses - Staff",
  description: "Find and apply to businesses",
};

export default function StaffBusinessesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffBusinessBrowser />
    </div>
  );
}
