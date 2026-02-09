"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Building2, MapPin, Clock } from "lucide-react";

import AddressForm from "@/components/provider/onboard/address-form";
import BusinessProfileForm from "@/components/provider/onboard/business-form";
import SlotForm from "@/components/provider/onboard/slot-form";

const STEP_MAP: Record<string, number> = {
  address: 1,
  business: 2,
  slots: 3,
  complete: 4,
};

const REVERSE_STEP_MAP: Record<number, string> = {
  1: "address",
  2: "business",
  3: "slots",
  4: "complete",
};

export default function OnboardSteps() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: "Address", icon: MapPin },
    { id: 2, label: "Business", icon: Building2 },
    { id: 3, label: "Availability", icon: Clock },
    { id: 4, label: "Complete", icon: Check },
  ];

  // Fetch profile status and validate current step
  useEffect(() => {
    const validateStep = async () => {
      try {
        setLoading(true);
        const stepParam = searchParams.get("step");

        console.log("(onboard-steps) stepParam", stepParam);

        // Fetch current profile completion status
        const [addressRes, businessRes, slotRes] = await Promise.all([
          fetch("/api/common/address").then((r) => r.json()),
          fetch("/api/provider/business").then((r) => r.json()),
          fetch("/api/provider/slots").then((r) => r.json()),
        ]);

        console.log("(onboard-steps) addressRes", addressRes);
        console.log("(onboard-steps) businessRes", businessRes);
        console.log("(onboard-steps) slotRes", slotRes);

        // TODO: if there have on onboarding related error then it may be appear here
        const hasAddress =
          addressRes && addressRes?.addresses?.length > 0 ? true : false;
        const hasBusiness = businessRes && businessRes.business ? true : false;
        const hasSlots =
          slotRes && Array.isArray(slotRes.slots) && slotRes.slots.length > 0
            ? true
            : false;

        console.log("(onboard-steps) hasAddress", hasAddress);
        console.log("(onboard-steps) hasBusiness", hasBusiness);
        console.log("(onboard-steps) hasSlots", hasSlots);

        let nextIncompleteStep = 1;
        if (hasAddress) nextIncompleteStep = 2;
        if (hasAddress && hasBusiness) nextIncompleteStep = 3;
        if (hasAddress && hasBusiness && hasSlots) nextIncompleteStep = 4;

        console.log("(onboard-steps) nextIncompleteStep", nextIncompleteStep);

        // If all steps completed, redirect to dashboard
        if (nextIncompleteStep === 4) {
          router.push("/provider/dashboard");
          return;
        }

        const requestedStepId = stepParam ? STEP_MAP[stepParam] : null;

        console.log("(onboard-steps) requestedStepId", requestedStepId);

        if (requestedStepId && requestedStepId < nextIncompleteStep) {
          console.log(
            "(onboard-steps) requestedStepId < nextIncompleteStep",
            requestedStepId < nextIncompleteStep,
          );
          console.log(
            `(onboard-step) A - /provider/onboard?step=${REVERSE_STEP_MAP[nextIncompleteStep]}`,
          );
          router.push(
            `/provider/onboard?step=${REVERSE_STEP_MAP[nextIncompleteStep]}`,
          );
          return;
        }

        // If valid step parameter, use it
        if (requestedStepId && requestedStepId <= nextIncompleteStep) {
          console.log(
            "(onboard-steps) requestedStepId < nextIncompleteStep",
            requestedStepId < nextIncompleteStep,
          );
          setStep(requestedStepId);
        } else {
          // Otherwise go to next incomplete step
          console.log(
            `(onboard-step) B - /provider/onboard?step=${REVERSE_STEP_MAP[nextIncompleteStep]}`,
          );
          setStep(nextIncompleteStep);
          if (!stepParam) {
            router.push(
              `/provider/onboard?step=${REVERSE_STEP_MAP[nextIncompleteStep]}`,
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("Onboarding validation error:", err);
        setError("Failed to load onboarding status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    validateStep();
  }, [searchParams, router]);

  const handleNext = () => {
    const nextStepId = step + 1;
    console.log("(handleNext) nextStepId", nextStepId);
    const nextStepName = REVERSE_STEP_MAP[nextStepId];
    console.log("(handleNext) nextStepName", nextStepName);

    router.push(`/provider/onboard?step=${nextStepName}`);
  };

  const isCompleted = (id: number) => {
    return id < step;
  };

  const isActive = (id: number) => id === step;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-sm animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 sm:px-6 md:px-8 py-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* STEP INDICATOR */}
        <div className="mb-8 sm:mb-12">
          {/* Desktop Stepper */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const completed = isCompleted(s.id);
                const active = isActive(s.id);

                return (
                  <div key={s.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-11 h-11 rounded-sm flex items-center justify-center
                          mb-2 transition-all duration-300
                          ${
                            active
                              ? "bg-blue-600 text-white shadow-lg scale-110"
                              : completed
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-400"
                          }
                        `}>
                        {completed && s.id !== 4 ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      <span
                        className={`
                          text-xs sm:text-sm font-medium text-center whitespace-nowrap
                          ${
                            active
                              ? "text-blue-600"
                              : completed
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        `}>
                        {s.label}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`
                          h-1 w-10 sm:w-16 mx-2 rounded transition-all duration-300
                          ${completed ? "bg-green-600" : "bg-gray-300"}
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Stepper */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Step {step} of {steps.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {steps[step - 1]?.label}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-sm h-2">
              <div
                className="bg-blue-600 h-2 rounded-sm transition-all duration-300"
                style={{ width: `${(step / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="w-full max-w-2xl mx-auto">
          {step === 1 && <AddressForm onNext={handleNext} />}
          {step === 2 && <BusinessProfileForm onNext={handleNext} />}
          {step === 3 && <SlotForm onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
}
