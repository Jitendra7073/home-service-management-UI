import { NextResponse } from "next/server";
import { getAuthToken, getUserByToken, getRefreshToken } from "../get-token";
import {
  isPublicRoute,
  isProtectedRoute,
  hasRouteAccess,
  getRoleBasedRedirect,
  isProviderOnboardingRoute,
  isRestrictedRoute,
  isPendingApprovalRoute,
} from "./middleware-helpers";

import { providerOnboardingMiddleware } from "./provider-onboard-checks";

// Try to refresh session using the refresh token cookie via our API route
async function refreshSession(req: any) {
  try {
    const refreshUrl = new URL("/api/auth/refresh-token", req.nextUrl.origin);
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const setCookie = res.headers.get("set-cookie") || null;
    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.accessToken) return null;

    return {
      accessToken: body.accessToken as string,
      setCookie,
    };
  } catch (err) {
    console.error("refreshSession error", err);
    return null;
  }
}

function attachSetCookieHeader(response: NextResponse, setCookie: string | null) {
  if (!setCookie) return;
  // Forward raw Set-Cookie header from backend refresh route
  response.headers.set("set-cookie", setCookie);
}

const authMiddleware = async (req: any) => {
  const { pathname } = req.nextUrl;

  try {
    let token = (await getAuthToken()) as string | null;
    const refreshToken = await getRefreshToken();
    let refreshedSetCookie: string | null = null;

    // ============ HANDLE ROOT "/" ROUTE ============
    if (pathname === "/") {
      // No tokens - redirect to login
      if (!token && !refreshToken) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // No access token but has refresh token - refresh silently
      if (!token && refreshToken) {
        const refreshed = await refreshSession(req);
        if (!refreshed) {
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        token = refreshed.accessToken;
        refreshedSetCookie = refreshed.setCookie;
      }

      // Validate token and redirect to role-based route
      let { user, error } = await getUserByToken(token as string);

      if (error || !user) {
        if (refreshToken) {
          const refreshed = await refreshSession(req);
          if (refreshed) {
            token = refreshed.accessToken;
            refreshedSetCookie = refreshed.setCookie;
            const retry = await getUserByToken(token);
            user = retry.user;
            error = retry.error;
          }
        }

        if (error || !user) {
          const loginUrl = new URL("/auth/login", req.url);
          const res = NextResponse.redirect(loginUrl);
          res.cookies.delete("accessToken");
          res.cookies.delete("refreshToken");
          return res;
        }
      }

      // Redirect based on role
      if (user.role === "admin") {
        const res = NextResponse.redirect(new URL("/admin", req.url));
        attachSetCookieHeader(res, refreshedSetCookie);
        return res;
      }

      if (user.role === "customer") {
        // Check if customer is restricted
        if (user.isRestricted) {
          const res = NextResponse.redirect(new URL("/restricted", req.url));
          attachSetCookieHeader(res, refreshedSetCookie);
          return res;
        }
        const res = NextResponse.redirect(new URL("/customer", req.url));
        attachSetCookieHeader(res, refreshedSetCookie);
        return res;
      }

      if (user.role === "provider") {
        // Check if provider is restricted
        if (user.isRestricted) {
          const res = NextResponse.redirect(new URL("/restricted", req.url));
          attachSetCookieHeader(res, refreshedSetCookie);
          return res;
        }

        // Check if provider has pending business approval
        const hasPendingBusiness = user.businesses?.some(
          (b: any) => !b.isApproved && !b.isRejected
        );

        if (hasPendingBusiness && !isPendingApprovalRoute(pathname)) {
          const res = NextResponse.redirect(new URL("/provider/pending-approval", req.url));
          attachSetCookieHeader(res, refreshedSetCookie);
          return res;
        }

        // Check provider onboarding status
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token || undefined
        );

        if (onboardRedirect) {
          attachSetCookieHeader(onboardRedirect, refreshedSetCookie);
          return onboardRedirect;
        }

        const res = NextResponse.redirect(new URL("/provider/dashboard", req.url));
        attachSetCookieHeader(res, refreshedSetCookie);
        return res;
      }

      // Unknown role - redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ============ HANDLE PUBLIC ROUTES ============
    if (isPublicRoute(pathname)) {
      // If user is already authenticated, redirect to their dashboard
      if (token) {
        const { user, error } = await getUserByToken(token);

        if (!error && user) {
          return NextResponse.redirect(
            new URL(getRoleBasedRedirect(user.role), req.url)
          );
        }

        // Token invalid but refresh token exists: refresh silently
        if (refreshToken) {
          const refreshed = await refreshSession(req);
          if (refreshed) {
            token = refreshed.accessToken;
            refreshedSetCookie = refreshed.setCookie;
            const retry = await getUserByToken(token);
            if (retry.user && !retry.error) {
              const res = NextResponse.redirect(
                new URL(getRoleBasedRedirect(retry.user.role), req.url)
              );
              attachSetCookieHeader(res, refreshed.setCookie);
              return res;
            }
          }
        }
      }

      return NextResponse.next();
    }

    // ============ HANDLE PROTECTED ROUTES ============
    if (isProtectedRoute(pathname)) {
      // No access token - try refresh token first
      if (!token) {
        if (refreshToken) {
          const refreshed = await refreshSession(req);
          if (refreshed) {
            token = refreshed.accessToken;
            refreshedSetCookie = refreshed.setCookie;
          } else {
            const loginUrl = new URL("/auth/login", req.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
          }
        } else {
          const loginUrl = new URL("/auth/login", req.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }
      }

      // Validate access token
      let { user, error } = await getUserByToken(token as string);

      if (error || !user) {
        if (refreshToken) {
          const refreshed = await refreshSession(req);
          if (refreshed) {
            token = refreshed.accessToken;
            refreshedSetCookie = refreshed.setCookie;
            const retry = await getUserByToken(token);
            user = retry.user;
            error = retry.error;
          }
        }

        if (error || !user) {
          const loginUrl = new URL("/auth/login", req.url);
          loginUrl.searchParams.set("redirect", pathname);
          const res = NextResponse.redirect(loginUrl);
          res.cookies.delete("accessToken");
          res.cookies.delete("refreshToken");
          return res;
        }
      }

      // ============ ROLE-BASED ACCESS CONTROL ============
      if (!hasRouteAccess(pathname, user.role)) {
        // User trying to access wrong role's route
        // Redirect to their own dashboard
        const res = NextResponse.redirect(
          new URL(getRoleBasedRedirect(user.role), req.url)
        );
        attachSetCookieHeader(res, refreshedSetCookie);
        return res;
      }

      // ============ RESTRICTED USER CHECK ============
      if (user.isRestricted && !isRestrictedRoute(pathname)) {
        // Redirect to restricted page
        const res = NextResponse.redirect(new URL("/restricted", req.url));
        attachSetCookieHeader(res, refreshedSetCookie);
        return res;
      }

      // ============ PROVIDER PENDING APPROVAL CHECK ============
      if (user.role === "provider" && !isPendingApprovalRoute(pathname) && !isProviderOnboardingRoute(pathname)) {
        const hasPendingBusiness = user.businesses?.some(
          (b: any) => !b.isApproved && !b.isRejected
        );

        if (hasPendingBusiness) {
          const res = NextResponse.redirect(new URL("/provider/pending-approval", req.url));
          attachSetCookieHeader(res, refreshedSetCookie);
          return res;
        }
      }

      // ============ PROVIDER ONBOARDING CHECK ============
      if (user.role === "provider" && !isProviderOnboardingRoute(pathname) && !isPendingApprovalRoute(pathname)) {
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token || undefined
        );

        // If onboarding incomplete, redirect to onboarding
        if (onboardRedirect) {
          attachSetCookieHeader(onboardRedirect, refreshedSetCookie);
          return onboardRedirect;
        }
      }

      // ============ PROVIDER ON ONBOARDING PAGE ============
      if (user.role === "provider" && isProviderOnboardingRoute(pathname)) {
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token || undefined
        );

        // Check if they should be on correct step
        if (onboardRedirect) {
          attachSetCookieHeader(onboardRedirect, refreshedSetCookie);
          return onboardRedirect;
        }
      }

      // Access granted - set user headers
      const response = NextResponse.next();
      response.headers.set("x-user-id", user.id);
      response.headers.set("x-user-role", user.role);
      attachSetCookieHeader(response, refreshedSetCookie);

      return response;
    }

    // ============ DEFAULT - ALLOW THROUGH ============
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);

    // Check if refresh token exists
    const refreshToken = await getRefreshToken();
    if (refreshToken && isProtectedRoute(pathname)) {
      // Best-effort silent refresh on unexpected errors
      const refreshed = await refreshSession(req);
      if (refreshed) {
        const response = NextResponse.next();
        attachSetCookieHeader(response, refreshed.setCookie);
        return response;
      }
    }

    // Error occurred - redirect to login
    const loginUrl = new URL("/auth/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }
};

export default authMiddleware;
