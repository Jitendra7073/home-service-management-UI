"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enable proactive token refresh
  useTokenRefresh();

  return <>{children}</>;
}
