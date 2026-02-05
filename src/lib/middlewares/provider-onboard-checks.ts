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
) => {
  const { pathname, searchParams } = req.nextUrl;

  // Only provider
  if (role !== "provider") return null;

  // Skip APIs
  if (pathname.startsWith("/api")) return null;

  // Only provider routes
  if (!pathname.startsWith("/provider")) return null;

  const currentStep = searchParams.get("step");

  const [address, business, slots] = await Promise.all([
    getProviderAddress(req),
    getProviderBusiness(req),
    getProviderSlots(req),
  ]);

  const hasAddress = address?.length > 0;
  const hasBusiness = !!business;
  const hasSlots = Array.isArray(slots) && slots.length > 0;

  console.log("(middleware) Address", hasAddress);
  console.log("(middleware) Business", hasBusiness);
  console.log("(middleware) Slots", hasSlots);

  // Determine next required step
  const nextStep = !hasAddress
    ? "address"
    : !hasBusiness
    ? "business"
    : !hasSlots
    ? "slots"
    : null;

  console.log("nextStep", nextStep);
  // ✅ Fully completed → block onboarding route
  if (!nextStep) {
    console.log("(middleware) Redirecting on the dashbaord...", pathname);
    if (pathname.startsWith(ONBOARD)) {
      return NextResponse.redirect(new URL(DASHBOARD, req.url));
    }
    return null; // allow dashboard + other provider routes
  }

  // ✅ Not completed yet → force onboarding
  if (!pathname.startsWith(ONBOARD)) {
    console.log("(middleware) Not completed yet → force onboarding");
    const redirect = new URL(ONBOARD, req.url);
    redirect.searchParams.set("step", nextStep);
    return NextResponse.redirect(redirect);
  }

  // ✅ On onboarding but wrong step → correct it
  if (currentStep !== nextStep) {
    console.log("(middleware) Onboarding but wrong step → correct it");
    const redirect = new URL(ONBOARD, req.url);
    redirect.searchParams.set("step", nextStep);
    return NextResponse.redirect(redirect);
  }

  return null;
};
