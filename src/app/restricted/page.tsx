"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface UserData {
  isRestricted: boolean;
  restrictionReason?: string;
}

export default function RestrictedPage() {
  const [restrictionReason, setRestrictionReason] = useState<string>("");

  useEffect(() => {
    // Fetch user data to get restriction reason
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });


        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const user: UserData = data.user;
            setRestrictionReason(
              user.restrictionReason || "Your account has been restricted due to violation of our policies."
            );
          }
        } else {
          console.error("[Restricted Page] Failed response:", res.status);
        }
      } catch (error) {
        console.error("[Restricted Page] Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Account Restricted
          </h1>

          <p className="mb-6 text-lg text-gray-600">
            You are restricted from accessing this platform
          </p>

          {restrictionReason && (
            <div className="mb-8 w-full rounded-lg border border-red-200 bg-red-50 p-6">
              <p className="mb-2 text-sm font-semibold text-red-900">
                Reason for Restriction
              </p>
              <p className="text-base text-red-800">{restrictionReason}</p>
            </div>
          )}

          <div className="max-w-md space-y-3 text-sm text-gray-500">
            <p>
              If you believe this is a mistake or would like to appeal this restriction,
              please contact our support team.
            </p>
            <p>
              Our team will review your case and get back to you within 24-48 hours.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="mailto:support@homeservice.com"
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
