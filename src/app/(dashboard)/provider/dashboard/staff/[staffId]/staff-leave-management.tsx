"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CalendarClock, FileText, CheckCircle2, XCircle, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
type LeaveType = "SICK" | "VACATION" | "PERSONAL" | "OTHER";

interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  leaveType: LeaveType;
  reason?: string;
  status: LeaveStatus;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectReason?: string;
  staff?: {
    name: string;
    email: string;
    mobile: string;
  };
}

interface StaffLeaveManagementProps {
  staffId: string;
}

export function StaffLeaveManagement({ staffId }: StaffLeaveManagementProps) {
  const queryClient = useQueryClient();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch staff leaves
  const { data, isLoading } = useQuery({
    queryKey: ["staff-leaves", staffId],
    queryFn: async () => {
      const response = await fetch(`/api/provider/staff/${staffId}/leave`, {
        credentials: "include",
      });
      return response.json();
    },
  });

  // Approve leave mutation
  const approveLeaveMutation = useMutation({
    mutationFn: async (leaveId: string) => {
      const response = await fetch(`/api/provider/staff/leave/${leaveId}/approve`, {
        method: "PUT",
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.msg || "Leave approved successfully");
        queryClient.invalidateQueries({ queryKey: ["staff-leaves", staffId] });
      } else {
        toast.error(data.msg || "Failed to approve leave");
      }
    },
    onError: () => {
      toast.error("Failed to approve leave");
    },
  });

  // Reject leave mutation
  const rejectLeaveMutation = useMutation({
    mutationFn: async ({ leaveId, reason }: { leaveId: string; reason: string }) => {
      const response = await fetch(`/api/provider/staff/leave/${leaveId}/reject`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectReason: reason }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.msg || "Leave rejected successfully");
        setRejectDialogOpen(false);
        setRejectReason("");
        setSelectedLeaveId(null);
        queryClient.invalidateQueries({ queryKey: ["staff-leaves", staffId] });
      } else {
        toast.error(data.msg || "Failed to reject leave");
      }
    },
    onError: () => {
      toast.error("Failed to reject leave");
    },
  });

  const handleApprove = (leaveId: string) => {
    if (window.confirm("Are you sure you want to approve this leave request?")) {
      approveLeaveMutation.mutate(leaveId);
    }
  };

  const handleRejectClick = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedLeaveId) {
      rejectLeaveMutation.mutate({ leaveId: selectedLeaveId, reason: rejectReason });
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Rejected
          </Badge>
        );
    }
  };

  const getLeaveTypeLabel = (type: LeaveType) => {
    switch (type) {
      case "SICK":
        return "Sick Leave";
      case "VACATION":
        return "Vacation";
      case "PERSONAL":
        return "Personal Leave";
      case "OTHER":
        return "Other";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const leaves: LeaveRequest[] = data?.leaves || data?.leaveRequests || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            Staff Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 animate-pulse rounded-sm"
                />
              ))}
            </div>
          ) : leaves.length > 0 ? (
            <div className="space-y-4">
              {leaves.map((leave) => (
                <Card
                  key={leave.id}
                  className={`${leave.status === "PENDING"
                    ? "border-yellow-200 bg-yellow-50/30"
                    : leave.status === "APPROVED"
                      ? "border-green-200 bg-green-50/30"
                      : "border-red-200 bg-red-50/30"
                    }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        {/* Header: Status and Type */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(leave.status)}
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200">
                            <FileText className="w-3 h-3 mr-1" />
                            {getLeaveTypeLabel(leave.leaveType)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Applied on {formatDate(leave.createdAt)}
                          </span>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">From:</span>
                            <span>{formatDate(leave.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">To:</span>
                            <span>{formatDate(leave.endDate)}</span>
                          </div>
                          {(leave.startTime || leave.endTime) && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <span className="font-medium">Time:</span>
                              <span>
                                {leave.startTime || "--:--"} - {leave.endTime || "--:--"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Reason */}
                        {leave.reason && (
                          <div className="text-sm text-gray-600 bg-white/50 p-3 rounded-sm border border-gray-200">
                            <span className="font-medium">Reason: </span>
                            {leave.reason}
                          </div>
                        )}

                        {/* Additional Info for Approved/Rejected */}
                        {leave.status === "APPROVED" && leave.approvedAt && (
                          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              Approved on {formatDate(leave.approvedAt)}
                            </span>
                          </div>
                        )}

                        {leave.status === "REJECTED" && (
                          <div className="space-y-2">
                            {leave.rejectedAt && (
                              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-2 rounded-sm">
                                <XCircle className="w-4 h-4" />
                                <span>
                                  Rejected on {formatDate(leave.rejectedAt)}
                                </span>
                              </div>
                            )}
                            {leave.rejectReason && (
                              <div className="text-sm text-red-700 bg-red-50 p-3 rounded-sm border border-red-200">
                                <span className="font-medium">Reason: </span>
                                {leave.rejectReason}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for Pending Leaves */}
                      {leave.status === "PENDING" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(leave.id)}
                            disabled={approveLeaveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700">
                            {approveLeaveMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(leave.id)}
                            disabled={rejectLeaveMutation.isPending}>
                            {rejectLeaveMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No leave requests found
              </p>
              <p className="text-gray-500 text-sm">
                This staff member hasn't submitted any leave requests yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request. This will
              be communicated to the staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejectReason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {rejectReason.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
                setSelectedLeaveId(null);
              }}
              disabled={rejectLeaveMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={rejectLeaveMutation.isPending || !rejectReason.trim()}>
              {rejectLeaveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject Leave
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
