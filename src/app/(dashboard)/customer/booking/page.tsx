import BookingComponent from "@/components/customer/booking";
import { Suspense } from "react";

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
