import { NextResponse } from "next/server";
import { getAuthToken, getUserByToken, getRefreshToken } from "../get-token";
import {
  isPublicRoute,
  isProtectedRoute,
  hasRouteAccess,
  getRoleBasedRedirect,
  isProviderOnboardingRoute,
} from "./middleware-helpers";

import { providerOnboardingMiddleware } from "./provider-onboard-checks";

const authMiddleware = async (req: any) => {
  const { pathname } = req.nextUrl;

  try {
    const token = await getAuthToken() as string;
    const refreshToken = await getRefreshToken();

    // ============ HANDLE ROOT "/" ROUTE ============
    if (pathname === "/") {
      // No tokens - redirect to login
      if (!token && !refreshToken) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // No access token but has refresh token - let client refresh
      if (!token && refreshToken) {
        const response = NextResponse.next();
        response.headers.set("x-token-refresh-needed", "true");
        return response;
      }

      // Validate token and redirect to role-based route
      const { user, error } = await getUserByToken(token);

      if (error || !user) {
        // Token invalid but has refresh token - let client refresh
        if (refreshToken) {
          const response = NextResponse.next();
          response.headers.set("x-token-refresh-needed", "true");
          return response;
        }

        // No valid tokens - redirect to login
        const loginUrl = new URL("/auth/login", req.url);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }

      // Redirect based on role
      if (user.role === "customer") {
        return NextResponse.redirect(new URL("/customer", req.url));
      }

      if (user.role === "provider") {
        // Check provider onboarding status
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token
        );

        if (onboardRedirect) return onboardRedirect;

        return NextResponse.redirect(new URL("/provider/dashboard", req.url));
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
          // Already logged in - redirect to role-based dashboard
          return NextResponse.redirect(
            new URL(getRoleBasedRedirect(user.role), req.url)
          );
        }
      }

      // Not authenticated or invalid token - allow access to public routes
      return NextResponse.next();
    }

    // ============ HANDLE PROTECTED ROUTES ============
    if (isProtectedRoute(pathname)) {
      // No access token - check for refresh token
      if (!token) {
        if (refreshToken) {
          // Has refresh token - let client handle refresh
          const response = NextResponse.next();
          response.headers.set("x-token-refresh-needed", "true");
          return response;
        }

        // No tokens at all - redirect to login
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Validate access token
      const { user, error } = await getUserByToken(token);

      if (error || !user) {
        // Token invalid - check for refresh token
        if (refreshToken) {
          // Has refresh token - let client handle refresh
          const response = NextResponse.next();
          response.headers.set("x-token-refresh-needed", "true");
          return response;
        }

        // No valid tokens - redirect to login
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }

      // ============ ROLE-BASED ACCESS CONTROL ============
      if (!hasRouteAccess(pathname, user.role)) {
        // User trying to access wrong role's route
        // Redirect to their own dashboard
        return NextResponse.redirect(
          new URL(getRoleBasedRedirect(user.role), req.url)
        );
      }

      // ============ PROVIDER ONBOARDING CHECK ============
      if (user.role === "provider" && !isProviderOnboardingRoute(pathname)) {
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token
        );

        // If onboarding incomplete, redirect to onboarding
        if (onboardRedirect) return onboardRedirect;
      }

      // ============ PROVIDER ON ONBOARDING PAGE ============
      if (user.role === "provider" && isProviderOnboardingRoute(pathname)) {
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token
        );

        // Check if they should be on correct step
        if (onboardRedirect) return onboardRedirect;
      }

      // Access granted - set user headers
      const response = NextResponse.next();
      response.headers.set("x-user-id", user.id);
      response.headers.set("x-user-role", user.role);

      return response;
    }

    // ============ DEFAULT - ALLOW THROUGH ============
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);

    // Check if refresh token exists
    const refreshToken = await getRefreshToken();
    if (refreshToken && isProtectedRoute(pathname)) {
      // Allow through and let client handle refresh
      const response = NextResponse.next();
      response.headers.set("x-token-refresh-needed", "true");
      return response;
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
