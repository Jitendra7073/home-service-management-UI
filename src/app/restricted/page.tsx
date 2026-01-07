"use client";

import { useUserProfile } from "@/hooks/use-queries";
import { Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RestrictedPage() {
  const { data: user, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // If user is loaded and NOT restricted, redirect them out of here
    if (!isLoading && user && !user.data?.isRestricted) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/auth/login"; 
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/auth/login";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Account Restricted
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        Your account has been restricted by the administrator. You cannot access the platform at this time.
        {user?.data?.restrictionReason && (
          <span className="block mt-4 p-4 bg-muted rounded-md text-sm font-medium text-foreground">
            Reason: {user.data.restrictionReason}
          </span>
        )}
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
        <Button onClick={() => window.location.href = "mailto:support@homeservice.com"}>
          Contact Support
        </Button>
      </div>
    </div>
  );
}
