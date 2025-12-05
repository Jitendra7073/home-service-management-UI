import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthToken, getUserByToken } from "./lib/get-token";

// Route configuration for better scalability
const ROUTE_CONFIG = {
  public: ["/", "/auth/login", "/auth/register", "/auth/forgot-password"],
  roleRedirects: {
    customer: "/customer",
    provider: "/provider",
  },
  protectedPrefixes: ["/customer", "/provider"],
} as const;

type UserRole = keyof typeof ROUTE_CONFIG.roleRedirects;

// Helper: Check if route is public
function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.public.includes(pathname);
}

// Helper: Check if route requires authentication
function isProtectedRoute(pathname: string): boolean {
  return ROUTE_CONFIG.protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

// Helper: Get redirect URL based on user role
function getRoleBasedRedirect(role: string): string | null {
  return ROUTE_CONFIG.roleRedirects[role as UserRole] || null;
}

// Helper: Check if user has access to the route
function hasRouteAccess(pathname: string, userRole: string): boolean {
  // Extract the base path (e.g., "/customer" from "/customer/dashboard")
  const basePath = `/${pathname.split("/")[1]}`;
  const allowedPath = getRoleBasedRedirect(userRole);

  return allowedPath ? pathname.startsWith(allowedPath) : false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  try {
    // Get authentication token
    const token = await getAuthToken();

    // Handle unauthenticated users
    if (!token) {
      // Allow access to public routes
      if (isPublicRoute(pathname)) {
        return NextResponse.next();
      }

      // Redirect to login for protected routes
      if (isProtectedRoute(pathname)) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    }

    // Handle authenticated users
    const { user } = await getUserByToken(token);

    // Invalid token or user not found
    if (!user) {
      const loginUrl = new URL("/auth/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid token
      response.cookies.delete("auth-token");
      return response;
    }

    console.log("User role:", user.role);

    // Redirect authenticated users from public routes to their dashboard
    if (isPublicRoute(pathname)) {
      const roleRedirect = getRoleBasedRedirect(user.role);
      if (roleRedirect) {
        return NextResponse.redirect(new URL(roleRedirect, req.url));
      }
    }

    // Check if user has access to protected routes
    if (isProtectedRoute(pathname) && !hasRouteAccess(pathname, user.role)) {
      // Redirect to appropriate dashboard if accessing wrong role area
      const roleRedirect = getRoleBasedRedirect(user.role);
      if (roleRedirect) {
        return NextResponse.redirect(new URL(roleRedirect, req.url));
      }

      // Fallback to forbidden
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // Add user info to headers for use in server components
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
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
