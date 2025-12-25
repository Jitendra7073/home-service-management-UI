import React from "react";
import Explore from "@/components/customer/explore";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <Explore />
    </Suspense>
  );
}

function BookingLoading() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      Loading Services details...
    </div>
  );
}
