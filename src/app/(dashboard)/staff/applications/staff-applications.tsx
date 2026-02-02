"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export default function StaffApplications() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res: any[] = [];
      return res;
    },
  });

  const applications = data || [];

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

  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">
          Track the status of your business applications
        </p>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-4 w-1/3 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by browsing businesses and sending applications
          </p>
          <a
            href="/staff/businesses"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Browse Businesses
          </a>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
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
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.coverLetter && (
                  <div>
                    <p className="text-sm font-medium mb-2">Cover Letter:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
                {application.status === "REJECTED" &&
                  application.rejectionReason && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                      <p className="text-sm font-medium text-destructive mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}
                {application.status === "APPROVED" && (
                  <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Congratulations! Your application has been approved. You
                      can now start receiving bookings from this business.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Category: {application.businessProfile?.category.name}
                  </span>
                  <span>•</span>
                  <span>
                    Contact: {application.businessProfile?.contactEmail}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
