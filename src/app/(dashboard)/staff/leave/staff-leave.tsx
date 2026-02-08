"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, FileText, Send, Plus, XCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { StaffLeaveSkeleton } from "@/components/staff/skeletons/staff-leave-skeleton";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
type LeaveType = "SICK" | "VACATION" | "PERSONAL" | "OTHER";

interface LeaveRequest {
  id: string;
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
}

export default function StaffLeave() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    leaveType: "" as LeaveType | "",
    reason: "",
  });

  // Fetch leave requests
  const { data, isLoading } = useQuery({
    queryKey: ["staff-leaves"],
    queryFn: async () => {
      const res = await fetch("/api/staff/leave", {
        credentials: "include",
      });
      return res.json();
    },
  });

  // Create leave request mutation
  const createLeaveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/staff/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.msg || "Leave request submitted successfully");
        setShowForm(false);
        setFormData({
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          leaveType: "",
          reason: "",
        });
        queryClient.invalidateQueries({ queryKey: ["staff-leaves"] });
      } else {
        toast.error(data.msg || "Failed to submit leave request");
      }
    },
    onError: () => {
      toast.error("Failed to submit leave request");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.startDate || !formData.endDate || !formData.leaveType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start > end) {
      toast.error("Start date cannot be after end date");
      return;
    }

    createLeaveMutation.mutate(formData);
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

  const leaves: LeaveRequest[] = data?.leaves || [];

  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-2">
            Apply for leave and view your leave history
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {showForm ? (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Apply for Leave
            </>
          )}
        </Button>
      </div>

      {/* Leave Application Form */}
      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Apply for Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">
                  Leave Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, leaveType: value as LeaveType })
                  }
                  required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="VACATION">Vacation</SelectItem>
                    <SelectItem value="PERSONAL">Personal Leave</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              {/* Time Range (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide a reason for your leave request..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {formData.reason.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={createLeaveMutation.isPending}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLeaveMutation.isPending}
                  className="min-w-[120px]">
                  {createLeaveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Leave History
        </h2>
        {isLoading ? (
          <StaffLeaveSkeleton />
        ) : leaves.length > 0 ? (
          <div className="space-y-4">
            {leaves.map((leave) => (
              <Card
                key={leave.id}
                className={`hover:shadow-md transition-shadow ${leave.status === "PENDING"
                  ? "border-yellow-200 bg-yellow-50/30"
                  : leave.status === "APPROVED"
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
                  }`}>
                <CardContent className="px-6">
                  <div className="flex items-start justify-between">
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
                            <Clock className="w-4 h-4 text-gray-500" />
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
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No leave requests found
              </p>
              <p className="text-gray-500 text-sm">
                You haven't applied for any leave yet. Click the button above to
                submit your first leave request.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
