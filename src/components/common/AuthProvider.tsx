"use client";

import { useEffect } from "react";
import { setupTokenRefresh } from "@/lib/api-client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Setup automatic token refresh
    setupTokenRefresh();
  }, []);

  return <>{children}</>;
}