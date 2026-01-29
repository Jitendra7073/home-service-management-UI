"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-queries";

interface AuthGuardProps {
  children: React.ReactNode;
  role: "customer" | "provider" | "admin";
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const { data, isLoading, error } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // If loading, do nothing yet
    if (isLoading) return;

    // If no user found (401 or null), redirect to login
    if (error || !data?.user) {
      // Use replace to prevent back button looping
      router.replace("/auth/login");
      return;
    }

    // Role-based protection
    if (data.user.role !== role) {
      if (data.user.role === "admin") router.replace("/admin");
      else if (data.user.role === "customer") router.replace("/customer");
      else if (data.user.role === "provider")
        router.replace("/provider/dashboard");
      else router.replace("/auth/login");
    }
  }, [data, isLoading, error, role, router]);

  // For SEO purposes, we render children even while loading or identifying.
  // This allows the initial HTML (which contains Metadata) to be served and indexed.
  // Real users will be redirected by the useEffect immediately after hydration.
  return <>{children}</>;
}
