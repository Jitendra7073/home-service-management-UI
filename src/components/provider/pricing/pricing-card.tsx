"use client";

import { Check, ShieldCheck, Lock, CreditCard } from "lucide-react";

function PricingHero() {
  const highlights = [
    "Verified Business Listing",
    "Customer Booking Access",
    "Business Analytics",
  ];

  return (
    <section className="py-14 text-center space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
        Grow Your Business. Get Real Customers.
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        To publish your business and start receiving customer bookings, an
        active subscription is required. Choose a plan that fits your growth
        goals.
      </p>

      <ul className="flex flex-wrap justify-center gap-3 pt-3">
        {highlights.map((item, index) => (
          <li
            key={index}
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600">
            <Check className="h-4 w-4 text-green-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function BenefitsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 px-4 text-sm text-gray-700">
      {items.map((benefit, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="h-4 w-4 text-green-600 mt-0.5" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}

function PricingCard({ plan }: { plan: any }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-white p-3 transition hover:shadow-lg ${
        plan.popular ? "border-blue-600" : "border-gray-200"
      }`}>
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <div className="rounded-2xl bg-gray-50 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>

        <p className="text-3xl font-bold text-gray-900">
          ₹{plan.price}
          <span className="text-sm font-normal text-gray-500">
            {" "}
            / {plan.durationInMonths === 12 ? "year" : "month"}
          </span>
        </p>

        <button
          className={`w-full rounded-full py-2 text-sm font-semibold transition ${
            plan.popular
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}>
          Choose Plan
        </button>
      </div>

      <div className="pt-5 mt-3 pb-5">
        <BenefitsList items={plan.benefits} />
      </div>

      <div className="mt-4 border-t pt-3 text-center text-xs text-gray-500">
        Publishing unlocked with subscription
      </div>
    </div>
  );
}

function WhySubscriptionRequired() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Quality & Trust",
      desc: "Subscriptions help maintain verified, serious business listings.",
    },
    {
      icon: Lock,
      title: "Platform Safety",
      desc: "Prevents fake or inactive businesses from appearing publicly.",
    },
    {
      icon: CreditCard,
      title: "Sustainable Support",
      desc: "Supports platform maintenance, updates, and customer support.",
    },
  ];

  return (
    <section className="py-14 bg-gray-50 rounded-3xl">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Why is a Subscription Required?
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Our subscription model ensures fairness, trust, and better business
          visibility for committed service providers.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-4">
        {reasons.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white p-6 text-center space-y-3">
            <item.icon className="h-6 w-6 text-blue-600 mx-auto" />
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatYouGetSection() {
  const included = [
    "Publish your business profile",
    "List and manage services",
    "Receive customer bookings",
    "Business analytics & earnings",
    "Higher search visibility",
    "Priority support",
  ];

  return (
    <section className="py-14">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          What You Get With a Subscription
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Everything you need to grow and manage your business online.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white border rounded-3xl p-6">
        <BenefitsList items={included} />
      </div>
    </section>
  );
}

function PricingPolicies() {
  const policies = [
    "Subscription is required to publish and activate services",
    "Plans are valid for the selected duration only",
    "No refunds after subscription activation",
    "Business visibility pauses after subscription expiry",
    "You can upgrade plans anytime",
  ];

  return (
    <section className="py-14 bg-gray-50 rounded-3xl">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Pricing & Subscription Policies
        </h2>
      </div>

      <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6">
        <BenefitsList items={policies} />
      </div>
    </section>
  );
}

export default function PricingSection() {
  const pricingPlans = [
    {
      id: "monthly",
      durationInMonths: 1,
      title: "1 Month Plan",
      price: 499,
      popular: false,
      benefits: [
        "List up to 3 services",
        "Basic analytics",
        "Low profile visibility",
      ],
    },
    {
      id: "quarterly",
      durationInMonths: 3,
      title: "3 Months Plan",
      price: 1299,
      popular: true,
      benefits: [
        "List up to 10 services",
        "Advanced analytics",
        "Higher profile visibility",
      ],
    },
    {
      id: "yearly",
      durationInMonths: 12,
      title: "1 Year Plan",
      price: 4499,
      popular: false,
      benefits: [
        "Unlimited services",
        "Premium analytics",
        "Top profile visibility",
      ],
    },
  ];

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-6">
        <PricingHero />

        <div className="w-full max-w-[1200px] mx-auto ">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-14">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        <WhySubscriptionRequired />
        <WhatYouGetSection />
        <PricingPolicies />
      </div>
    </div>
  );
}
