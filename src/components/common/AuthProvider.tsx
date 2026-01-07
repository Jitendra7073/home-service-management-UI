"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useUserProfile } from "@/hooks/use-queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enable proactive token refresh
  useTokenRefresh();
  
  const { data: user, isLoading } = useUserProfile();

  const router = useRouter(); // Import useRouter from next/navigation at top of file if not present

  useEffect(() => {
    if (user?.user?.isRestricted) {
      router.replace("/restricted");
    }
  }, [user?.user?.isRestricted, router]);

  // We don't block rendering here because the restricted page itself handles the UI 
  // and the listener above handles the redirect.
  // However, to prevent flash of content, we can return null if restricted and not yet on that page?
  // But checking current path in a layout component is tricky without usePathname.
  // Let's just let the redirect happen. Use middleware for better protection if needed.

  return <>{children}</>;
}
