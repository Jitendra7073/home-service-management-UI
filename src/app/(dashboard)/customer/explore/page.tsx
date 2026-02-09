import React from "react";
import Explore from "@/components/customer/explore";
import { Suspense } from "react";
import type { Metadata } from "next";
import { CollectionPageSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Explore Home Services | Homhelper - Find Trusted Professionals",
  description:
    "Explore and discover top-rated home service providers near you. From cleaning and repairs to renovations and wellness - find verified professionals for every need.",
  keywords: [
    "explore home services",
    "find service providers",
    "home services near me",
    "trusted professionals",
    "verified service providers",
    "local home services",
    "book home services",
    "service providers directory",
    "home service marketplace",
  ],
  openGraph: {
    title: "Explore Home Services | Homhelper",
    description: "Find trusted home service professionals in your area",
    url: "/customer/explore",
  },
};

export default function ExplorePage() {
  return (
    <>
      {/* SEO: Structured Data */}
      <CollectionPageSchema
        name="Home Services Directory"
        description="Browse and discover top-rated home service providers on Homhelper. Find verified professionals for all your home service needs."
        url="/customer/explore"
      />

      <Suspense fallback={<BookingLoading />}>
        <Explore />
      </Suspense>
    </>
  );
}

function BookingLoading() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      Loading Services details...
    </div>
  );
}
