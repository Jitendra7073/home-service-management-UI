export function isPublicRoute(path: string) {
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  return publicRoutes.some((route) => path.startsWith(route));
}

export function isProtectedRoute(path: string) {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/provider") ||
    path.startsWith("/customer") ||
    path.startsWith("/staff")
  );
}

export function hasRouteAccess(path: string, role: string) {
  // Strict role-based access control
  if (path.startsWith("/provider")) {
    return role === "provider";
  }
  if (path.startsWith("/customer")) {
    return role === "customer";
  }
  if (path.startsWith("/admin")) {
    return role === "admin";
  }
  if (path.startsWith("/staff")) {
    return role === "staff";
  }
  return true;
}

export function getRoleBasedRedirect(role: string) {
  if (role === "admin") return "/admin";
  if (role === "provider") return "/provider/dashboard";
  if (role === "customer") return "/customer";
  if (role === "staff") return "/staff";
  return "/auth/login";
}

export function isProviderOnboardingRoute(path: string) {
  return path.startsWith("/provider/onboard");
}

export function isAdminRoute(path: string) {
  return path.startsWith("/admin");
}
