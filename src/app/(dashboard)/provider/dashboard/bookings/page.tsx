import BookingView from "./booking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Manage your bookings effectively with HomHelpers.",
};

export default function BookingsPage() {
  return <BookingView />;
}
