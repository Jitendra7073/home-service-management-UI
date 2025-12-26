export function isPublicRoute(path: string) {
  return path.startsWith("/auth") || path === "/";
}

export function isProtectedRoute(path: string) {
  return path.startsWith("/provider") || path.startsWith("/customer");
}

export function hasRouteAccess(path: string, role: string) {
  if (path.startsWith("/provider") && role !== "provider") return false;
  if (path.startsWith("/customer") && role !== "customer") return false;
  return true;
}

export function getRoleBasedRedirect(role: string) {
  if (role === "provider") return "/provider/dashboard";
  if (role === "customer") return "/customer";
  return "/auth/login";
}
