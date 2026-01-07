"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Building2 } from "lucide-react";

interface BusinessData {
  _id: string;
  name: string;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
}

interface UserData {
  businesses?: BusinessData[];
}

export default function PendingApprovalPage() {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });


      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const user: UserData = data.user;
          const pendingBusinesses =
            user.businesses?.filter(
              (b) => !b.isApproved && !b.isRejected
            ) || [];
          setBusinesses(pendingBusinesses);
        }
      } else {
        console.error("[Pending Approval] Failed response:", res.status);
      }
    } catch (error) {
      console.error("[Pending Approval] Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-2xl w-full mx-4 shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 rounded-full bg-yellow-100 p-6">
            <Clock className="h-16 w-16 text-yellow-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Business Under Review
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            Your business is currently being reviewed by our admin team
          </p>

          {!loading && businesses.length > 0 && (
            <div className="mb-8 w-full space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Pending Business{businesses.length > 1 ? "es" : ""}:
              </p>
              {businesses.map((business) => (
                <div
                  key={business._id}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4"
                >
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{business.name}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(business.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-md space-y-3 text-sm text-gray-500">
            <p>
              Our admin team is reviewing your business application to ensure it meets
              our quality standards and guidelines.
            </p>
            <p>
              You will be able to access your provider dashboard and create services
              once your business has been approved.
            </p>
            <p className="font-medium text-gray-700">
              This usually takes 1-2 business days. We appreciate your patience!
            </p>
          </div>

          <div className="mt-8 rounded-md border border-blue-200 bg-blue-50 p-4 max-w-md">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">What happens next?</span>
            </p>
            <ul className="mt-2 text-left text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Our team will review your business details</li>
              <li>You'll receive a notification once approved</li>
              <li>After approval, you can create and publish services</li>
              <li>Your business will become visible to customers</li>
            </ul>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            This screen will automatically disappear once your business is approved.
            Please refresh the page if you believe your business has been approved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
