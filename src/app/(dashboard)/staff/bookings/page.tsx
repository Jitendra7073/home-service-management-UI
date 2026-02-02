import StaffBookings from "./staff-bookings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings - Staff",
  description: "View and manage your assigned bookings",
};

export default function StaffBookingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffBookings />
    </div>
  );
}
