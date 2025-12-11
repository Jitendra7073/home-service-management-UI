import { NextResponse } from "next/server";
import { getAuthToken, getUserByToken } from "../get-token";
import {
  isPublicRoute,
  isProtectedRoute,
  getRoleBasedRedirect,
  hasRouteAccess,
} from "../middlewares/middleware-helpers";
import { providerOnboardingMiddleware } from "../middlewares/provider-onboard-checks";

const authMiddleware = async (req: any) => {
  const { pathname } = req.nextUrl;

  try {
    const token = await getAuthToken();

    // Redirect unauthenticated users from home page to login
    if (pathname === "/") {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // No token - handle public/protected routes
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

    // Token exists - validate user
    const { user } = await getUserByToken(token);

    // Invalid token or user not found
    if (!user) {
      const loginUrl = new URL("/auth/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      return response;
    }

    console.log("User role:", user.role);

    // Authenticated users accessing public routes - redirect to dashboard
    if (isPublicRoute(pathname)) {
      const roleRedirect = getRoleBasedRedirect(user.role);
      if (roleRedirect) {
        return NextResponse.redirect(new URL(roleRedirect, req.url));
      }
    }

    // Check if user has access to protected routes
    if (isProtectedRoute(pathname) && !hasRouteAccess(pathname, user.role)) {
      const roleRedirect = getRoleBasedRedirect(user.role);
      if (roleRedirect) {
        return NextResponse.redirect(new URL(roleRedirect, req.url));
      }
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // Provider onboarding check - run before allowing access to provider routes
    if (user.role === "provider") {
      const onboardingResponse = await providerOnboardingMiddleware(
        req,
        user.role,
        user.id,
        token
      );

      // If onboarding middleware returns a redirect, use it
      if (onboardingResponse.status !== 200) {
        return onboardingResponse;
      }
    }

    // User authenticated and authorized - allow access
    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", user.role);

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, allow public routes but protect others
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
};

export default authMiddleware;
