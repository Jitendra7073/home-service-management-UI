import StaffLeave from "./staff-leave";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Management",
  description: "Apply for leave and view your leave history",
};

export default function StaffLeavePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffLeave />
    </div>
  );
}
