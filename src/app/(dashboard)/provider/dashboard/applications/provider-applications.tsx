"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffAPI, type BusinessApplication } from "@/lib/api/staff";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ApplicationStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function ProviderApplications() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus>("PENDING");
  const [selectedApplication, setSelectedApplication] =
    useState<BusinessApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["business-applications", statusFilter],
    queryFn: async () => {
      const res = await staffAPI.getBusinessApplications({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page: 1,
        limit: 50,
      });
      return res.data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({
      applicationId,
      status,
      rejectionReason,
    }: {
      applicationId: string;
      status: "APPROVED" | "REJECTED";
      rejectionReason?: string;
    }) => {
      const res = await staffAPI.respondToApplication(applicationId, {
        status,
        rejectionReason,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg || "Application updated successfully");
      queryClient.invalidateQueries({ queryKey: ["business-applications"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsDialogOpen(false);
      setRejectionReason("");
      setSelectedApplication(null);
      setActionType(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update application");
    },
  });

  const applications = data?.applications || [];
  const pendingCount = applications.filter(
    (a: BusinessApplication) => a.status === "PENDING",
  ).length;

  const handleRespond = () => {
    if (!selectedApplication || !actionType) return;

    if (actionType === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    respondMutation.mutate({
      applicationId: selectedApplication.id,
      status: actionType === "approve" ? "APPROVED" : "REJECTED",
      rejectionReason: actionType === "reject" ? rejectionReason : undefined,
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Staff Applications
          </h2>
          <p className="text-muted-foreground">
            Review and respond to staff applications
            {pendingCount > 0 && ` (${pendingCount} pending)`}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as ApplicationStatus)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applications List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-1/3 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground">
            {statusFilter === "PENDING"
              ? "No pending applications at the moment"
              : `No ${statusFilter.toLowerCase()} applications`}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application: BusinessApplication) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {application.staffProfile?.user.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied{" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                      {application.respondedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Responded{" "}
                          {new Date(
                            application.respondedAt,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">
                      {application.staffProfile?.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Mobile:</span>
                    <span className="font-medium">
                      {application.staffProfile?.user.mobile}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium font-mono text-xs">
                      {application.staffProfileId.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div>
                    <p className="text-sm font-medium mb-2">Cover Letter:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-3">
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
                      This staff member has been approved and can now receive
                      bookings from your business.
                    </p>
                  </div>
                )}

                {application.status === "PENDING" && (
                  <div className="flex gap-2 justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedApplication(application);
                            setActionType("reject");
                          }}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Application</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for rejecting this
                            application. This will be shared with the staff
                            member.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="rejectionReason">
                              Rejection Reason *
                            </Label>
                            <Textarea
                              id="rejectionReason"
                              placeholder="Explain why you're rejecting this application..."
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              rows={5}
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setRejectionReason("");
                              }}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleRespond}
                              disabled={respondMutation.isPending}>
                              {respondMutation.isPending
                                ? "Rejecting..."
                                : "Reject Application"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedApplication(application);
                        setActionType("approve");
                        handleRespond();
                      }}
                      disabled={respondMutation.isPending}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {respondMutation.isPending ? "Approving..." : "Approve"}
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
