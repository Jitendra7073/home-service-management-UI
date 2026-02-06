import { Metadata } from "next";
import { redirect } from "next/navigation";
import StaffBookingsView from "./staff-bookings-view";

export const metadata: Metadata = {
  title: "Staff Bookings - Provider Portal",
  description: "View all bookings assigned to your staff members",
};

export default function StaffBookingsPage() {
  // This is a placeholder - the actual component will handle everything
  return <StaffBookingsView />;
}
