import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getProviderAddress,
  getProviderBusiness,
  getProviderSlots,
} from "./provider-checks";

const ONBOARDING_BASE = "/provider/onboard";
const DASHBOARD = "/provider/dashboard";

// helper - same as you have
function getNextOnboardingStep(profile: {
  hasAddress: boolean;
  hasBusiness: boolean;
  hasSlots: boolean;
}): "address" | "business" | "slots" | null {
  if (!profile.hasAddress) return "address";
  if (!profile.hasBusiness) return "business";
  if (!profile.hasSlots) return "slots";
  return null;
}

/**
 * providerOnboardingMiddleware - robust, loop-free
 * NOTE: req, userRole, userId, token must be passed from main middleware.
 */
export const providerOnboardingMiddleware = async (
  req: NextRequest,
  userRole?: string,
  userId?: string,
  token?: string
) => {
  const { pathname, searchParams } = req.nextUrl;

  // 0) Skip everything that's not provider area or if missing required args
  if (!pathname.startsWith("/provider")) return NextResponse.next();
  if (pathname.startsWith("/api")) return NextResponse.next(); // don't run on API
  if (userRole !== "provider" || !userId || !token) return NextResponse.next();

  // 1) If the request is already for onboarding base (we'll still allow specific-step checks below)
  const currentStep = searchParams.get("step"); // may be null

  // 2) Attempt to fetch profile. If it fails, DO NOT redirect (avoid loop).
  let profile: {
    hasAddress: boolean;
    hasBusiness: boolean;
    hasSlots: boolean;
  } | null = null;

  try {
    const [addressData, businessData, slotsData] = await Promise.all([
      getProviderAddress(req),
      getProviderBusiness(req),
      getProviderSlots(req),
    ]);

    // If provider-check endpoints return an error shape, treat as failure (null)
    // Expecting shape { success: true, data: ... } or array for slots; adapt to your API
    if (!addressData || !businessData || !slotsData) {
      profile = null;
    } else {
      // Adjust these checks to match your API response shapes
      const hasAddress = addressData?.address != null ? true : false;
      const hasBusiness = businessData?.business != null ? true : false;
      const hasSlots =
        Array.isArray(slotsData?.slots) && slotsData.slots.length > 0;

      profile = { hasAddress, hasBusiness, hasSlots };
    }
  } catch (err) {
    console.error("Provider profile fetch failed:", err);
    profile = null;
  }

  // 3) If profile fetch failed, DO NOT redirect to onboarding — let auth/main middleware decide.
  if (!profile) {
    return NextResponse.next();
  }

  // 4) Decide next step
  const nextStep = getNextOnboardingStep(profile);

  // 5) If no next step -> onboarding complete -> allow access
  if (!nextStep) {
    // If user is currently on onboarding pages (rare), send to dashboard — but only if NOT already dashboard
    if (pathname.startsWith(ONBOARDING_BASE) && pathname !== DASHBOARD) {
      const dashUrl = new URL(DASHBOARD, req.url);
      return NextResponse.redirect(dashUrl);
    }
    return NextResponse.next();
  }

  // 6) If user is already on the exact onboarding step -> allow (avoid redirect loop)
  if (pathname.startsWith(ONBOARDING_BASE) && currentStep === nextStep) {
    return NextResponse.next();
  }

  // 7) Redirect to the required onboarding step (but only if we're not already there)
  const target = new URL(ONBOARDING_BASE, req.url);
  target.searchParams.set("step", nextStep);

  // Avoid redirect loop: only redirect if current path is different from target path+params
  const isSamePath =
    pathname === target.pathname &&
    target.searchParams.get("step") === currentStep;

  if (!isSamePath) {
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
};
