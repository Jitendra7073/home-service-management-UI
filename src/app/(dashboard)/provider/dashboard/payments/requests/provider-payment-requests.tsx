"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MapPin,
  IndianRupee,
  Send,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

export function ProviderPaymentRequestsClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [percentage, setPercentage] = useState<number>(50);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-payment-requests", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/requests?${params}`,
        {
          credentials: "include",
        },
      );
      const result = await res.json();
      return result;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/${requestId}/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ percentage }),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment approved and processed successfully!");
        setShowApproveDialog(false);
        setSelectedRequest(null);
        setPercentage(50);
        queryClient.invalidateQueries({
          queryKey: ["provider-payment-requests"],
        });
      } else {
        toast.error(data.msg || "Failed to approve payment");
      }
      setIsProcessing(false);
    },
    onError: () => {
      toast.error("Error approving payment");
      setIsProcessing(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/${requestId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectionReason }),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment request rejected successfully!");
        setShowRejectDialog(false);
        setSelectedRequest(null);
        setRejectionReason("");
        queryClient.invalidateQueries({
          queryKey: ["provider-payment-requests"],
        });
      } else {
        toast.error(data.msg || "Failed to reject payment");
      }
      setIsProcessing(false);
    },
    onError: () => {
      toast.error("Error rejecting payment");
      setIsProcessing(false);
    },
  });

  const handleApprove = () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    approveMutation.mutate(selectedRequest.id);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsProcessing(true);
    rejectMutation.mutate(selectedRequest.id);
  };

  const calculateStaffAmount = (
    requestedAmount: number,
    percentage: number,
  ) => {
    return Math.round(requestedAmount * 0.9 * (percentage / 100));
  };

  const requests = data?.requests || [];

  if (isLoading) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8">
          <Loader2 className="animate-spin w-8 h-8 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Review and approve payment requests from your staff
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="ALL">All Requests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {statusFilter === "PENDING" && "Pending Requests"}
                {statusFilter === "APPROVED" && "Approved Requests"}
                {statusFilter === "REJECTED" && "Rejected Requests"}
                {statusFilter === "ALL" && "All Requests"}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({requests.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No payment requests found
                  </h3>
                  <p className="text-gray-600">
                    {statusFilter === "PENDING"
                      ? "No pending payment requests at the moment."
                      : `No ${statusFilter.toLowerCase()} requests found.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request: any) => {
                    const StatusIcon =
                      STATUS_ICONS[
                        request.requestStatus as keyof typeof STATUS_ICONS
                      ];
                    return (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-gray-900">
                                {request.serviceName}
                              </h3>
                              <Badge
                                variant="outline"
                                className={
                                  STATUS_COLORS[
                                    request.requestStatus as keyof typeof STATUS_COLORS
                                  ]
                                }>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {request.requestStatus}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <div>
                                  <span className="font-medium">
                                    {request.staffName}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>{request.staffMobile}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{request.bookingDate}</span>
                                <span className="mx-2">•</span>
                                <span>{request.slotTime}</span>
                              </div>
                            </div>

                            {request.staffFeedback && (
                              <div className="bg-gray-50 rounded p-3 mb-3">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Staff Feedback:
                                  </span>{" "}
                                  {request.staffFeedback}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-green-600">
                                ₹{request.servicePrice}
                              </div>
                              {request.requestStatus === "PENDING" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setShowRejectDialog(true);
                                    }}>
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setShowApproveDialog(true);
                                    }}>
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Review & Pay
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Approve Staff Payment
            </DialogTitle>
            <DialogDescription>
              Review the payment request and set the percentage to pay the staff
              member.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              {/* Staff Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                  Staff Member
                </h4>
                <p className="font-medium">{selectedRequest.staffName}</p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.staffMobile}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.staffEmail}
                </p>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                  Service Details
                </h4>
                <p className="font-medium">{selectedRequest.serviceName}</p>
                <p className="text-sm text-gray-600">
                  Date: {selectedRequest.bookingDate}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {selectedRequest.slotTime}
                </p>
                <p className="text-sm text-gray-600">
                  Customer: {selectedRequest.customerName}
                </p>
              </div>

              {/* Staff Feedback */}
              {selectedRequest.staffFeedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    Staff Feedback
                  </h4>
                  <p className="text-sm text-blue-800 italic">
                    "{selectedRequest.staffFeedback}"
                  </p>
                </div>
              )}

              {/* Percentage Input */}
              <div className="space-y-3">
                <Label htmlFor="percentage">Percentage to Pay Staff (%)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="percentage"
                    type="number"
                    min={0}
                    max={100}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-32 text-lg font-semibold"
                  />
                  <span className="text-gray-600">of provider earnings</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Price:</span>
                    <span className="font-medium">
                      ₹{selectedRequest.servicePrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Provider Earnings (90%):
                    </span>
                    <span className="font-medium">
                      ₹{Math.round(selectedRequest.servicePrice * 0.9)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-green-300 pt-1">
                    <span>Staff will receive:</span>
                    <span className="text-green-700">
                      ₹
                      {calculateStaffAmount(
                        selectedRequest.servicePrice,
                        percentage,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApproveDialog(false);
                    setSelectedRequest(null);
                    setPercentage(50);
                  }}
                  disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700">
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Pay ₹
                      {calculateStaffAmount(
                        selectedRequest.servicePrice,
                        percentage,
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Reject Payment Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{selectedRequest.serviceName}</p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.staffName}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reject-reason">Reason for Rejection *</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Explain why you're rejecting this payment request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This reason will be sent to the staff member.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setSelectedRequest(null);
                    setRejectionReason("");
                  }}
                  disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing}
                  variant="destructive">
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Reject Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
