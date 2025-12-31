import React from "react";
import Explore from "@/components/customer/explore";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | Fixora",
  description: "Discover and explore services with Fixora.",
};


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
