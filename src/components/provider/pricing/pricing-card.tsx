"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import PricingSkeleton from "./pricingSkeleton";

/* ----------------------- BENEFITS ----------------------- */

const PLAN_BENEFITS: Record<string, string[]> = {
  PREMIMUM: [
    "Publish business profile",
    "List up to 5 services",
    "Receive customer bookings",
    "Basic business analytics",
    "Standard support",
    "30 days free trial included",
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
    <section className="py-8 text-center space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Grow Your Business. Get Real Customers.
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Start with our 30-day free trial on the PREMIUM plan or unlock full power with PRO.
      </p>

      <ul className="flex flex-wrap justify-center gap-3 pt-4">
        {highlights.map((item, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-700">
            <Check className="h-4 w-4 text-blue-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------- PRICING CARD ----------------------- */

function PricingCard({
  plan,
  isActive,
  isLoading,
  onSubscribe,
  isInTrial = false,
  trialEndDate = null,
  isTrialEligible = false,
}: any) {
  const benefits = PLAN_BENEFITS[plan.name] ?? [];
  const isPremium = plan.name.toUpperCase() === "PREMIMUM";

  const daysRemaining = trialEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(trialEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-7 transition-all ${
        isActive || (isPremium && isTrialEligible)
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white hover:shadow-lg"
      }`}
    >
      {/* Badge */}
      {(isInTrial || (isPremium && isTrialEligible && !isInTrial)) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
          {isInTrial ? "TRIAL ACTIVE" : "FREE TRIAL"}
        </div>
      )}

      {isActive && !isInTrial && (
        <span className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Active
        </span>
      )}

      {/* Price */}
      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {plan.name}
        </h3>

        {isInTrial && isPremium ? (
          <>
            <p className="text-4xl font-bold text-blue-700">
              {daysRemaining} Days
            </p>
            <p className="text-xs text-blue-600">
              Trial Remaining • Then ₹{plan.price}/month
            </p>
          </>
        ) : (
          <p className="text-4xl font-bold text-gray-900">
            ₹{plan.price}
            <span className="text-sm font-medium text-gray-500">
              {" "} / {plan.interval}
            </span>
          </p>
        )}

        {isPremium && isTrialEligible && !isInTrial && (
          <p className="text-xs text-gray-600">
            Free for 30 days • Cancel anytime
          </p>
        )}
      </div>

      {/* Benefits */}
      <ul className="flex-1 space-y-3 mb-6">
        {benefits.map((benefit: string, i: number) => (
          <li key={i} className="flex gap-3 text-sm text-gray-800">
            <Check className="h-4 w-4 text-blue-600 mt-0.5" />
            {benefit}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        disabled={
          isLoading ||
          isActive ||
          (isInTrial && isPremium)
        }
        onClick={() => onSubscribe(plan.stripePriceId)}
        className={`w-full rounded-full py-3 text-sm font-semibold transition ${
          isActive || (isInTrial && isPremium)
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        }`}
      >
        {isLoading
          ? "Processing..."
          : isInTrial && isPremium
          ? `Trial Ends in ${daysRemaining} Days`
          : isActive
          ? "Current Plan"
          : isPremium
          ? "Start Free Trial"
          : "Upgrade to PRO"}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Secure payments • No hidden charges
      </p>
    </div>
  );
}

/* ----------------------- MAIN ----------------------- */

export default function PricingSection() {
  const { data: plans } = useQuery({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      const res = await fetch("/api/provider/subscription");
      return res.json();
    },
    staleTime: Infinity,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
  });

  const activePlanName =
    profile?.user?.providerSubscription?.plan?.name?.toUpperCase() ?? "FREE";

  const subscriptionStatus =
    profile?.user?.providerSubscription?.status ?? "FREE";

  const isInTrial = subscriptionStatus === "trialing";
  const trialEndDate = profile?.user?.providerSubscription?.currentPeriodEnd;
  const isTrialEligible = activePlanName === "FREE" && !isInTrial;

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, isTrial }: any) => {
      const res = await fetch("/api/provider/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, isTrial }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  if (isLoading) return <PricingSkeleton />;

  const visiblePlans =
    plans?.filter((p: any) =>
      ["PREMIMUM", "PRO"].includes(p.name.toUpperCase())
    ) ?? [];

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl px-4 space-y-10">
        <PricingHero />

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 justify-center">
          {visiblePlans.map((plan: any) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isActive={activePlanName === plan.name.toUpperCase() && !isInTrial}
              isLoading={checkoutMutation.isPending}
              onSubscribe={(priceId: string) =>
                checkoutMutation.mutate({
                  priceId,
                  isTrial:
                    plan.name.toUpperCase() === "PREMIMUM" && isTrialEligible,
                })
              }
              isInTrial={isInTrial && plan.name.toUpperCase() === "PREMIMUM"}
              trialEndDate={trialEndDate}
              isTrialEligible={isTrialEligible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
