"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, ShieldCheck, Lock, CreditCard } from "lucide-react";

/* ================= HARDCODED BENEFITS ================= */

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

/* ================= HERO ================= */

function PricingHero() {
  const highlights = [
    "Verified Business Listing",
    "Customer Booking Access",
    "Business Analytics",
  ];

  return (
    <section className="py-5 text-center space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
        Grow Your Business. Get Real Customers.
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Choose the right plan to publish your business and start receiving
        customer bookings.
      </p>

      <ul className="flex flex-wrap justify-center gap-3 pt-3">
        {highlights.map((item, index) => (
          <li
            key={index}
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

/* ================= FREE PLAN CARD ================= */

function FreePlanCard() {
  return (
    <div className="relative flex flex-col rounded-3xl border-2 border-gray-300 bg-gray-50 p-6">
      {/* Badge */}
      <span className="absolute top-4 right-4 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
        Currently Active
      </span>

      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">
          Free Plan
        </h3>

        <p className="text-4xl font-extrabold text-gray-900">
          ₹0
          <span className="text-sm font-medium text-gray-500"> / forever</span>
        </p>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {FREE_BENEFITS.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-700"
          >
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        disabled
        className="w-full rounded-full py-2.5 text-sm font-semibold
                   bg-gray-300 text-gray-700 cursor-not-allowed"
      >
        Current Plan
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Upgrade to unlock customer bookings
      </p>
    </div>
  );
}

/* ================= PAID PLAN CARD ================= */

function PricingCard({
  plan,
  onSubscribe,
  isLoading,
}: {
  plan: any;
  onSubscribe: (priceId: string) => void;
  isLoading: boolean;
}) {
  const benefits = PLAN_BENEFITS[plan.name] ?? [];
  return (
    <div className="relative flex flex-col rounded-3xl border bg-white p-6 transition hover:shadow-xl">
      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900">
          {plan.name}
        </h3>

        <p className="text-4xl font-extrabold text-gray-900">
          ₹{plan.price}
          <span className="text-sm font-medium text-gray-500">
            {" "}
            / {plan.interval}
          </span>
        </p>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-700"
          >
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isLoading}
        onClick={() => onSubscribe(plan.stripePriceId)}
        className="w-full rounded-full py-2.5 text-sm font-semibold
                   bg-blue-600 text-white hover:bg-blue-700
                   transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Redirecting..." : "Upgrade Plan"}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Unlock bookings & visibility
      </p>
    </div>
  );
}

/* ================= INFO SECTIONS ================= */

function WhySubscriptionRequired() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Quality & Trust",
      desc: "Only subscribed businesses are publicly visible.",
    },
    {
      icon: Lock,
      title: "Platform Safety",
      desc: "Reduces spam and fake listings.",
    },
    {
      icon: CreditCard,
      title: "Sustainable Support",
      desc: "Supports platform development and support.",
    },
  ];

  return (
    <section className="py-14 bg-gray-50 rounded-3xl">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-4">
        {reasons.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white p-6 text-center space-y-3"
          >
            <item.icon className="h-6 w-6 text-blue-600 mx-auto" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= MAIN PAGE ================= */

export default function PricingSection() {
  const { data } = useQuery({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      const res = await fetch("/api/provider/subscription");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
  });
  console.log(data)

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

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-6">
        <PricingHero />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-14 max-w-[1200px] mx-auto">
          {/* Free Plan */}
          <FreePlanCard />

          {/* Paid Plans */}
          {data?.map((plan: any) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isLoading={checkoutMutation.isPending}
              onSubscribe={(priceId) =>
                checkoutMutation.mutate(priceId)
              }
            />
          ))}
        </div>

        {/* <WhySubscriptionRequired /> */}
      </div>
    </div>
  );
}
