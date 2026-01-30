import BookingComponent from "@/components/customer/booking";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Manage your bookings effectively with HomHelpers.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingComponent />
    </Suspense>
  );
}

function BookingLoading() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      Loading booking details...
    </div>
  );
}
