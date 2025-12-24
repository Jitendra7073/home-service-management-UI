"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import PricingSkeleton from "./pricingSkeleton";

/* ----------------------- BENEFITS ----------------------- */

const FREE_BENEFITS = [
  "Create business profile",
  "Manage services",
  "Create & manage service slots",
  "Update business information",
  "Manage business profile",
];

const PLAN_BENEFITS: Record<string, string[]> = {
  PREMIMUM: [
    "Publish business profile",
    "List up to 5 services",
    "Receive customer bookings",
    "Basic business analytics",
    "Standard support",
  ],
  PRO: [
    "Publish business profile",
    "Unlimited services",
    "Priority customer bookings",
    "Advanced analytics & reports",
    "Higher search visibility",
    "Priority support",
  ],
};

/* ----------------------- HERO ----------------------- */

function PricingHero() {
  const highlights = [
    "Verified Business Listing",
    "Customer Booking Access",
    "Business Analytics",
  ];

  return (
    <section className="py-6 text-center space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
        Grow Your Business. Get Real Customers.
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Choose the right plan to publish your business and start receiving
        customer bookings.
      </p>

      <ul className="flex flex-wrap justify-center gap-3 pt-3">
        {highlights.map((item, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600"
          >
            <Check className="h-4 w-4 text-green-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------- FREE PLAN CARD ----------------------- */

function FreePlanCard({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex flex-col rounded-3xl border-2 border-gray-300 bg-gray-50 p-6">
      {isActive && (
        <span className="absolute top-4 right-4 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
          Currently Active
        </span>
      )}

      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
        <p className="text-4xl font-extrabold text-gray-900">
          ₹0 <span className="text-sm font-medium text-gray-500">/ forever</span>
        </p>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {FREE_BENEFITS.map((benefit, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-600 mt-0.5" />
            {benefit}
          </li>
        ))}
      </ul>

      <button
        disabled
        className="w-full rounded-full py-2.5 text-sm font-semibold bg-gray-300 text-gray-700 cursor-not-allowed"
      >
        Current Plan
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Upgrade to unlock customer bookings
      </p>
    </div>
  );
}

/* ----------------------- PAID PLAN CARD ----------------------- */

function PricingCard({
  plan,
  isActive,
  isLoading,
  onSubscribe,
}: {
  plan: any;
  isActive: boolean;
  isLoading: boolean;
  onSubscribe: (priceId: string) => void;
}) {
  const benefits = PLAN_BENEFITS[plan.name] ?? [];

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 transition ${
        isActive ? "border-blue-600 shadow-lg" : "bg-white hover:shadow-xl"
      }`}
    >
      {isActive && (
        <span className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Currently Active
        </span>
      )}

      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-4xl font-extrabold text-gray-900">
          ₹{plan.price}
          <span className="text-sm font-medium text-gray-500">
            {" "}
            / {plan.interval}
          </span>
        </p>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-600 mt-0.5" />
            {benefit}
          </li>
        ))}
      </ul>

      <button
        disabled={isActive || isLoading}
        onClick={() => onSubscribe(plan.stripePriceId)}
        className={`w-full rounded-full py-2.5 text-sm font-semibold transition
          ${
            isActive
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        {isActive ? "Current Plan" : isLoading ? "Redirecting..." : "Upgrade"}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Unlock bookings & visibility
      </p>
    </div>
  );
}

/* ----------------------- MAIN PAGE ----------------------- */

export default function PricingSection() {
  const { data: plans } = useQuery({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      const res = await fetch("/api/provider/subscription");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const activePlanName =
    profile?.user?.providerSubscription?.plan?.name?.toUpperCase() ?? "FREE";

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const res = await fetch("/api/provider/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      return res.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  if(isLoading){
    return <PricingSkeleton/>
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[1400px] px-4 space-y-6">
        <PricingHero />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12 max-w-[1200px] mx-auto">
          <FreePlanCard isActive={activePlanName === "FREE"} />

          {plans?.map((plan: any) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isActive={activePlanName === plan.name.toUpperCase()}
              isLoading={checkoutMutation.isPending}
              onSubscribe={(priceId) => checkoutMutation.mutate(priceId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
