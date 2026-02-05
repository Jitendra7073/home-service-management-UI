"use client";

import React from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, StickyNote, TriangleAlert } from "lucide-react";

import PricingSkeleton from "./pricingSkeleton";

import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

/* ----------------------- BENEFITS ----------------------- */

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

      <p className="text-sm text-gray-600 max-w-2xl text-center mx-auto">
        Start with our 7-day free trial on the PREMIUM plan or unlock full power
        with PRO.
      </p>

      <ul className="flex flex-wrap justify-center gap-3 pt-4">
        {highlights.map((item, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700">
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
  onCancel,
  onManage,
  subscriptionStatus,
  isCancelAtPeriodEnd,
  currentPeriodStart,
  currentPeriodEnd,
  isCancelLoading,
  isManageLoading,
  hasActivePaidSubscription,
}: any) {
  // Use dynamic benefits if available, otherwise fallback to hardcoded
  const benefits = plan.benefits ?? [];
  const isPremium = plan.name.toUpperCase() === "PREMIMUM";

  const daysRemaining = trialEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(trialEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return (
    <div
      className={`relative flex flex-col rounded-md border p-7 transition-all h-full ${
        isActive || (isPremium && isTrialEligible && !isActive)
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white hover:shadow-lg"
      }`}>
      {/* Badge */}
      {(isInTrial ||
        (isPremium && isTrialEligible && !isInTrial && !isActive)) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
          {isInTrial ? "TRIAL ACTIVE" : "FREE TRIAL"}
        </div>
      )}

      {isActive && !isInTrial && !isCancelAtPeriodEnd && (
        <span className="absolute top-4 right-4 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white uppercase">
          Active
        </span>
      )}

      {isCancelAtPeriodEnd && isActive && (
        <span className="absolute top-4 right-4 rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Cancelled
        </span>
      )}

      {/* Price */}
      <div className="mb-6 text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>

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
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-gray-900">
              ₹{plan.price}
              <span className="text-sm font-medium text-gray-500">
                {" "}
                / {plan.interval}
              </span>
            </p>
          </div>
        )}

        {isPremium && isTrialEligible && !isInTrial && !isActive && (
          <p className="text-xs text-gray-600">
            Free for 7 days • Cancel anytime
          </p>
        )}
      </div>

      <ul className="flex-1 space-y-3 mb-10">
        {benefits.map((benefit: string, i: number) => (
          <li key={i} className="flex gap-3 text-sm text-gray-800">
            <Check className="h-4 w-4 text-blue-600 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}

        {/* Platform Fee Benefit */}
        <li className="flex items-center justify-start gap-2 text-sm">
          <div className="flex items-center gap-3">
            <Check className="h-4 w-4 text-blue-600 mt-0.5" />
            <span className="text-gray-800">Platform Fee</span>
          </div>

          <span className="font-semibold text-gray-900">
            {plan.commissionRate ?? 10}%
            <span className="ml-1 text-xs font-normal text-gray-500">
              / booking
            </span>
          </span>
        </li>
      </ul>

      {isCancelAtPeriodEnd && isActive && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="mt-0.5 text-amber-500">
            <TriangleAlert size={18} />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-amber-800">
              Subscription Cancelled
            </p>

            <p className="text-xs text-amber-700">
              Your plan will remain active until the end of the current billing
              period.
            </p>

            {currentPeriodStart && currentPeriodEnd && (
              <div className="mt-1 text-xs text-gray-600">
                <span className="font-medium">Active Period:</span>{" "}
                {new Date(currentPeriodStart).toLocaleDateString()} —{" "}
                {new Date(currentPeriodEnd).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="mt-auto flex flex-col gap-3">
        {isActive ? (
          <>
            {/* Free Plan Active State */}
            {plan.price === 0 ? (
              <button
                disabled
                className="w-full cursor-default rounded-md bg-green-100 text-green-700 border border-green-200 py-3 text-sm font-semibold">
                Current Active Plan
              </button>
            ) : (
              <>
                {/* TRIALING STATE */}
                {subscriptionStatus === "trialing" && (
                  <>
                    {isCancelAtPeriodEnd ? (
                      <div className="flex flex-col gap-2">
                        <button
                          disabled={isManageLoading}
                          onClick={onManage}
                          className="w-full cursor-pointer rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm font-semibold transition sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                          {isManageLoading ? "Redirecting..." : "Manage"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex md:flex-row flex-col gap-2 justify-between items-center">
                        <button
                          disabled={isCancelLoading}
                          onClick={onCancel}
                          className="w-full cursor-pointer rounded-md bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {isCancelLoading ? "Cancelling..." : "Cancel Trial"}
                        </button>
                        <button
                          disabled={isManageLoading}
                          onClick={onManage}
                          className="w-full cursor-pointer rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm font-semibold transition sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                          {isManageLoading ? "Redirecting..." : "Manage"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ACTIVE STATE */}
                {subscriptionStatus === "active" && (
                  <>
                    {isCancelAtPeriodEnd ? (
                      <button
                        disabled={isManageLoading}
                        onClick={onManage}
                        className="w-full cursor-pointer rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm font-semibold transition sm:py-2.5 md:px-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isManageLoading ? "Redirecting..." : "Manage"}
                      </button>
                    ) : (
                      <div className="flex md:flex-row flex-col gap-2 justify-between items-center">
                        <button
                          disabled={isCancelLoading}
                          onClick={onCancel}
                          className="w-full cursor-pointer rounded-md bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {isCancelLoading ? "Cancelling..." : "Cancel"}
                        </button>
                        <button
                          disabled={isManageLoading}
                          onClick={onManage}
                          className="w-full cursor-pointer rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 md:px-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {isManageLoading ? "Redirecting..." : "Manage"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ERROR / FALLBACK STATE*/}
                {subscriptionStatus !== "trialing" &&
                  subscriptionStatus !== "active" && (
                    <button
                      disabled={isManageLoading}
                      onClick={onManage}
                      className="w-full cursor-pointer rounded-md bg-gray-800 text-white hover:bg-gray-900 py-3 md:px-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {isManageLoading ? "Redirecting..." : "Manage"}
                    </button>
                  )}
              </>
            )}
          </>
        ) : (
          <button
            disabled={
              isLoading || (plan.price === 0 && hasActivePaidSubscription)
            }
            onClick={() => onSubscribe(plan.stripePriceId)}
            className={`w-full cursor-pointer rounded-md bg-blue-600  hover:bg-blue-700 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
              plan.price === 0 && hasActivePaidSubscription
                ? "bg-gray-200 text-black border border-gray-200 cursor-not-allowed hover:bg-gray-200"
                : "text-white"
            }`}>
            {isLoading
              ? "Processing..."
              : plan.price === 0 && hasActivePaidSubscription
              ? "You have active subscription"
              : isPremium && isTrialEligible
              ? "Start Free Trial"
              : plan.price === 0
              ? "Get Started"
              : "Upgrade Now"}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Secure payments • No hidden charges
      </p>
    </div>
  );
}

/* ----------------------- MAIN ----------------------- */

export default function PricingSection() {
  const [processingPlanId, setProcessingPlanId] = React.useState<string | null>(
    null,
  );
  const {
    data: plans,
    isLoading: plansLoading,
    isFetching: plansFetching,
  } = useQuery({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      const res = await fetch("/api/provider/subscription");
      return res.json();
    },
    staleTime: Infinity,
  });

  const {
    data: profile,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
  });

  const subscription = profile?.user?.providerSubscription;

  const activePlanName = subscription?.plan?.name?.toUpperCase() ?? "FREE";
  const subscriptionStatus = subscription?.status ?? "FREE";

  const isInTrial = subscriptionStatus === "trialing";

  // Safely calculate trial end date
  const trialEndDate =
    isInTrial && subscription?.currentPeriodStart
      ? new Date(
          new Date(subscription.currentPeriodStart).getTime() +
            7 * 24 * 60 * 60 * 1000,
        )
      : null;

  const isTrialEligible = activePlanName === "FREE" && !isInTrial;

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, isTrial }: any) => {
      const res = await fetch("/api/provider/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, isTrial }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data: any) => {
      window.location.href = data.url;
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/provider/subscription/cancel", {
        method: "POST",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.msg);
        queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
      } else if (data.success === false) {
        toast.error(data.msg);
      }
    },
    onError: (error) => {
      console.error("Cancel subscription error:", error);
    },
  });

  const billingPortalURL = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/provider/subscription/billing", {
        method: "GET",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        window.location.href = data.url;
      } else if (data.success === false) {
        toast.error(data.msg);
      }
    },
    onError: (error) => {
      console.error("Cancel subscription error:", error);
    },
  });

  const visiblePlans = plans
    ? [...plans].sort((a: any, b: any) => a.price - b.price)
    : [];

  const isLoading = profileLoading || plansLoading;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl px-4 space-y-10">
        <PricingHero />

        {isLoading ? (
          <div className="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {[...Array(3)].map((_, i) => (
              <PricingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {visiblePlans.map((plan: any) => {
              const isCurrentPlanName =
                activePlanName === plan.name.toUpperCase();
              const isActive =
                isCurrentPlanName &&
                subscriptionStatus !== "FREE" &&
                subscriptionStatus !== "canceled";

              const isPaidSubscription =
                subscription?.plan?.price > 0 &&
                (subscription?.status === "active" ||
                  subscription?.status === "trialing");

              return (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onCancel={() => cancelSubscription.mutate()}
                  onManage={() => billingPortalURL.mutate()}
                  isActive={
                    plan.price === 0
                      ? activePlanName === plan.name.toUpperCase()
                      : isActive
                  }
                  subscriptionStatus={subscriptionStatus}
                  isCancelAtPeriodEnd={subscription?.cancelAtPeriodEnd}
                  isLoading={
                    checkoutMutation.isPending && processingPlanId === plan.id
                  }
                  currentPeriodStart={subscription?.currentPeriodStart}
                  currentPeriodEnd={subscription?.currentPeriodEnd}
                  isCancelLoading={cancelSubscription.isPending}
                  isManageLoading={billingPortalURL.isPending}
                  hasActivePaidSubscription={isPaidSubscription}
                  onSubscribe={(priceId: string) => {
                    setProcessingPlanId(plan.id);
                    checkoutMutation.mutate({
                      priceId,
                      isTrial:
                        plan.name.toUpperCase() === "PREMIMUM" &&
                        isTrialEligible,
                    });
                  }}
                  isInTrial={
                    isInTrial && plan.name.toUpperCase() === "PREMIMUM"
                  }
                  trialEndDate={trialEndDate}
                  isTrialEligible={isTrialEligible}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
