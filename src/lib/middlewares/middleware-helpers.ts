export function isPublicRoute(path: string) {
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  return publicRoutes.some(route => path.startsWith(route));
}

export function isProtectedRoute(path: string) {
  return path.startsWith("/provider") || path.startsWith("/customer");
}

export function hasRouteAccess(path: string, role: string) {
  // Strict role-based access control
  if (path.startsWith("/provider")) {
    return role === "provider";
  }
  if (path.startsWith("/customer")) {
    return role === "customer";
  }
  return true;
}

export function getRoleBasedRedirect(role: string) {
  if (role === "provider") return "/provider/dashboard";
  if (role === "customer") return "/customer";
  return "/auth/login";
}

export function isProviderOnboardingRoute(path: string) {
  return path.startsWith("/provider/onboard");
}
