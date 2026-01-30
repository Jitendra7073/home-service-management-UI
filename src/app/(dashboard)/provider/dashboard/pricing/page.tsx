import PricingSection from "@/components/provider/pricing/pricing-card";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Manage your pricing effectively with HomHelpers.",
};

const Pricing = () => {
  return (
    <div>
      <PricingSection />
    </div>
  );
};

export default Pricing;
