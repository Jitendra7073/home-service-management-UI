"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Check,
  Star,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Search",
    shortDesc: "Discover the right service",
    description:
      "Browse trusted services and use smart filters to quickly find what matches your needs.",
    features: [
      "Smart service search",
      "Advanced filters",
      "Real-time availability",
    ],
    icon: Search,
  },
  {
    id: 2,
    title: "Choose",
    shortDesc: "Select service & time",
    description:
      "Compare providers, review details, and choose a time slot that works best for you.",
    features: [
      "Provider comparison",
      "Flexible time slots",
      "Transparent pricing",
    ],
    icon: Calendar,
  },
  {
    id: 3,
    title: "Book Service",
    shortDesc: "Confirm securely",
    description:
      "Review your booking details and complete the process with instant confirmation.",
    features: ["Secure booking", "Instant confirmation", "Verified details"],
    icon: Check,
  },
  {
    id: 4,
    title: "Give Feedback",
    shortDesc: "Share your experience",
    description:
      "Rate your service and help others by sharing honest feedback.",
    features: ["Easy ratings", "Helpful reviews", "Community trust"],
    icon: Star,
  },
];

export default function StepsLayout() {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

  return (
    <section className="py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Our Process
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl">
            Simple, transparent steps designed to help you book services
            effortlessly.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex gap-10">
          {/* Steps */}
          <div className="w-80 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full p-5 rounded-md text-left transition-all duration-200 ${
                    isActive
                      ? " border bg-slate-900 text-white"
                      : " border border-gray-300  hover:bg-slate-50"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-blue-600" : "text-slate-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs uppercase font-medium opacity-70">
                        Step {step.id}
                      </div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm opacity-80">{step.shortDesc}</p>
                    </div>

                    {isActive && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className=" border border-gray-300 rounded-md p-10 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-100 rounded-md">
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className="w-7 h-7 text-blue-600" />;
                  })()}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {steps[activeStep].title}
                </h3>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                {steps[activeStep].description}
              </p>

              <div className="space-y-4">
                {steps[activeStep].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isOpen = expandedMobile === index;

            return (
              <div
                key={step.id}
                className="bg-white border border-slate-200 rounded-md overflow-hidden">
                <button
                  onClick={() => {
                    setActiveStep(index);
                    setExpandedMobile(isOpen ? null : index);
                  }}
                  className={`w-full p-4 flex items-center justify-between ${
                    isOpen
                      ? "bg-slate-900 text-white"
                      : "bg-white hover:bg-slate-50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isOpen ? "text-blue-400" : "text-slate-400"
                      }`}
                    />
                    <span className="font-medium">{step.title}</span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Smooth Accordion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <div className="p-5 border-t border-slate-200">
                      <p className="text-slate-600 mb-4">{step.description}</p>

                      <div className="space-y-3">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-slate-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
