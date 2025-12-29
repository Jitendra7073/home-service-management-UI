import { NextResponse } from "next/server";
import { getAuthToken, getUserByToken } from "../get-token";
import {
  isPublicRoute,
  isProtectedRoute,
  hasRouteAccess,
  getRoleBasedRedirect,
} from "./middleware-helpers";

import { providerOnboardingMiddleware } from "./provider-onboard-checks";

const authMiddleware = async (req: any) => {
  const { pathname } = req.nextUrl;

  try {
    const token = await getAuthToken();

    // Handle root "/" route
    if (pathname === "/") {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      const { user, error } = await getUserByToken(token);

      if (error || !user) {
        const loginUrl = new URL("/auth/login", req.url);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("accessToken");
        return res;
      }

      // Customer root redirect
      if (user.role === "customer") {
        return NextResponse.redirect(new URL("/customer", req.url));
      }

      // Provider root redirect with onboarding check
      if (user.role === "provider") {
        const onboardRedirect = await providerOnboardingMiddleware(
          req,
          user.role,
          user.id,
          token
        );

        if (onboardRedirect) return onboardRedirect;

        return NextResponse.redirect(new URL("/provider/dashboard", req.url));
      }

      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // No token found
    if (!token) {
      if (isPublicRoute(pathname)) {
        return NextResponse.next();
      }

      if (isProtectedRoute(pathname)) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    // Validate token
    const { user, error } = await getUserByToken(token);

    if (error || !user) {
      const loginUrl = new URL("/auth/login", req.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("accessToken");
      return res;
    }

    // Public route but authenticated
    if (isPublicRoute(pathname)) {
      return NextResponse.redirect(
        new URL(getRoleBasedRedirect(user.role), req.url)
      );
    }

    // Role access check
    if (isProtectedRoute(pathname) && !hasRouteAccess(pathname, user.role)) {
      return NextResponse.redirect(
        new URL(getRoleBasedRedirect(user.role), req.url)
      );
    }

    // Provider onboarding check
    if (user.role === "provider") {
      const onboardRedirect = await providerOnboardingMiddleware(
        req,
        user.role,
        user.id,
        token
      );

      if (onboardRedirect) return onboardRedirect;
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", user.role);

    return response;
  } catch (err) {
    console.error("Middleware error:", err);

    const loginUrl = new URL("/auth/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");

    return response;
  }
};

export default authMiddleware;
