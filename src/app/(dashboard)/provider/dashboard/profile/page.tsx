import StaffProfile from "./staff-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Provider",
  description: "Manage your Provider profile and availability",
};

export default function StaffProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffProfile />
    </div>
  );
}
