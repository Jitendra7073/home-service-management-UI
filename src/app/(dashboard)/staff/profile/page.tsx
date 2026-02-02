import StaffProfile from "./staff-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Staff",
  description: "Manage your staff profile and availability",
};

export default function StaffProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffProfile />
    </div>
  );
}
