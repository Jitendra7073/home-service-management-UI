// Route configuration for better scalability
const ROUTE_CONFIG = {
  public: ["/auth/login", "/auth/register", "/auth/forgot-password"],
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
  const allowedPath = getRoleBasedRedirect(userRole);
  return allowedPath ? pathname.startsWith(allowedPath) : false;
}

export {
  isPublicRoute,
  isProtectedRoute,
  getRoleBasedRedirect,
  hasRouteAccess,
};
export type { UserRole };
export default ROUTE_CONFIG;
