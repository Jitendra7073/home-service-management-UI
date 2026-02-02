import StaffView from "./staff";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management",
  description: "Manage your staff members, assignments, and availability",
};

export default function StaffPage() {
  return <StaffView />;
}
