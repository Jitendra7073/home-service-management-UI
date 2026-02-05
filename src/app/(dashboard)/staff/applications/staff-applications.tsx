"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { StaffApplicationsSkeleton } from "@/components/staff/skeletons";

type TabType = "all" | "approved" | "rejected" | "pending";

export default function StaffApplications() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as TabType | null;

  // Initialize activeTab from URL or default to "all"
  const [activeTab, setActiveTab] = useState<TabType>(
    (statusParam === "approved" || statusParam === "rejected" || statusParam === "pending")
      ? statusParam
      : "all"
  );

  // Update URL when tab changes
  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "all") {
      params.delete("status");
    } else {
      params.set("status", newTab);
    }

    // Update URL without refreshing
    router.push(`/staff/applications?${params.toString()}`, { scroll: false });
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-applications", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") {
        params.append("status", activeTab);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/applications?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    },
  });

  const applications = data?.applications || [];

  // Show skeleton while loading
  if (isLoading) {
    return <StaffApplicationsSkeleton />;
  }

  const handleCancelApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/applications/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Application cancelled successfully");
        refetch();
      } else {
        toast.error(result.msg || "Failed to cancel application");
      }
    } catch (error) {
      toast.error("Error cancelling application");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="default"
            className="gap-1 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "all", label: "All", count: 0 },
    { key: "approved", label: "Approved", count: 0 },
    { key: "rejected", label: "Rejected", count: 0 },
    { key: "pending", label: "Pending", count: 0 },
  ];

  // Calculate counts
  const allApplications = data?.applications || [];

  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">
          Track the status of your business applications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const count = tab.key === "all"
            ? allApplications.length
            : allApplications.filter((app: any) => app.status.toLowerCase() === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}>
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border rounded-md shadow-sm">
              <CardHeader>
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-muted rounded mt-2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-20 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab !== "all"
              ? `No ${activeTab} applications found`
              : "Start by browsing businesses and sending applications"}
          </p>
          <a
            href="/staff/businesses"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Browse Businesses
          </a>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application: any) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {application.businessProfile?.businessName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Category: {application.businessProfile?.category?.name || "N/A"}
                  </span>
                  <span>
                    Contact: {application.businessProfile?.contactEmail}
                  </span>
                </div>

                {application.status === "APPROVED" && (
                  <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Congratulations! Your application has been approved. You
                      can now start receiving bookings from this business.
                    </p>
                  </div>
                )}

                {application.status === "PENDING" && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelApplication(application.id)}
                      className="gap-1">
                      <X className="h-4 w-4" />
                      Cancel Application
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
