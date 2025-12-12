import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getProviderAddress,
  getProviderBusiness,
  getProviderSlots,
} from "./provider-checks";

const ONBOARD = "/provider/onboard";
const DASHBOARD = "/provider/dashboard";

export const providerOnboardingMiddleware = async (
  req: NextRequest,
  role?: string,
  userId?: string,
  token?: string
) => {
  const { pathname, searchParams } = req.nextUrl;

  // Only apply onboarding logic for provider role
  if (role !== "provider") return null;

  // Skip API calls
  if (pathname.startsWith("/api")) return null;

  // Skip non-provider routes
  if (!pathname.startsWith("/provider")) return null;

  const currentStep = searchParams.get("step");

  const [address, business, slots] = await Promise.all([
    getProviderAddress(req),
    getProviderBusiness(req),
    getProviderSlots(req),
  ]);

  const profile = {
    hasAddress: !!address,
    hasBusiness: !!business,
    hasSlots: Array.isArray(slots) && slots.length > 0,
  };

  // Determine next step
  const nextStep = !profile.hasAddress
    ? "address"
    : !profile.hasBusiness
    ? "business"
    : !profile.hasSlots
    ? "slots"
    : null;

  // All steps completed
  if (!nextStep) {
    if (pathname.startsWith(ONBOARD)) {
      return NextResponse.redirect(new URL(DASHBOARD, req.url));
    }
    return null;
  }

  // User is not on onboarding page
  if (!pathname.startsWith(ONBOARD)) {
    const redirect = new URL(ONBOARD, req.url);
    redirect.searchParams.set("step", nextStep);
    return NextResponse.redirect(redirect);
  }

  // User is on onboarding but wrong step
  if (currentStep !== nextStep) {
    const redirect = new URL(ONBOARD, req.url);
    redirect.searchParams.set("step", nextStep);
    return NextResponse.redirect(redirect);
  }

  return null;
};
