"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
  TrendingUp,
  Users,
  Download,
  ArrowLeft,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_ICONS = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

export default function ProviderPaymentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("statistics");

  // Requests state
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [percentage, setPercentage] = useState<number>(50);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // History state
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Fetch statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["provider-payment-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/stats`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
  });

  // Fetch pending requests for statistics tab
  const { data: pendingRequestsData, error: pendingError } = useQuery({
    queryKey: ["provider-payment-requests", "PENDING"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/requests?status=PENDING`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        console.error("API Error:", res.status, res.statusText);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    },
  });

  // Fetch all requests for requests tab
  const {
    data: requestsData,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery({
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
      return res.json();
    },
  });

  // Fetch payment history
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: [
      "provider-payment-history",
      historyStatusFilter,
      staffFilter,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (historyStatusFilter !== "all") {
        params.append("status", historyStatusFilter);
      }
      if (staffFilter) {
        params.append("staffId", staffFilter);
      }
      params.append("page", page.toString());
      params.append("limit", "20");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/history?${params}`,
        {
          credentials: "include",
        },
      );
      return res.json();
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
        queryClient.invalidateQueries({ queryKey: ["provider-payment-stats"] });
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
        queryClient.invalidateQueries({ queryKey: ["provider-payment-stats"] });
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

  const stats = statsData?.stats;
  const pendingRequests = pendingRequestsData?.requests || [];
  const requests = requestsData?.requests || [];
  const payments = historyData?.payments || [];
  const historyStats = historyData?.stats;
  const pagination = historyData?.pagination;

  const handleExport = () => {
    toast.success("Export feature coming soon!");
  };

  return (
    <>
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-7xl px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Staff Payments
              </h1>
              <p className="text-gray-600 mt-2">
                Manage payment requests and view payment history
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/provider/dashboard")}
              className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {stats?.pendingRequests > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 px-2 py-0 text-xs">
                    {stats?.pendingRequests}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* STATISTICS TAB */}
            <TabsContent value="statistics" className="space-y-6 mt-6">
              {statsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : statsError ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <p className="text-red-800">
                      Error loading statistics. Please try again later.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Main Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-yellow-900">
                            Pending Requests
                          </CardTitle>
                          <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-900 mb-1">
                          {stats?.pendingRequests || 0}
                        </div>
                        <p className="text-sm text-yellow-700">
                          Awaiting your review
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-green-900">
                            Approved Requests
                          </CardTitle>
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-900 mb-1">
                          {stats?.approvedRequests || 0}
                        </div>
                        <p className="text-sm text-green-700">
                          Successfully processed
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-red-900">
                            Rejected Requests
                          </CardTitle>
                          <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-900 mb-1">
                          {stats?.rejectedRequests || 0}
                        </div>
                        <p className="text-sm text-red-700">
                          Declined payments
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-blue-900">
                            Total Payments
                          </CardTitle>
                          <IndianRupee className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-900 mb-1">
                          {stats?.totalPayments || 0}
                        </div>
                        <p className="text-sm text-blue-700">
                          Completed transactions
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow ">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-emerald-900">
                            Total Amount Paid to Staff
                          </CardTitle>
                          <TrendingUp className="w-8 h-8 text-emerald-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-900 mb-1">
                          ₹{stats?.totalPaidAmount || 0}
                        </div>
                        <p className="text-sm text-emerald-700">
                          Across all payments
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow ">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-orange-900">
                            Pending Amount
                          </CardTitle>
                          <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-900 mb-1">
                          ₹{stats?.pendingAmount || 0}
                        </div>
                        <p className="text-sm text-orange-700">
                          Awaiting approval
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-sm">
                          <div className="text-sm text-gray-600 mb-2">
                            Approval Rate
                          </div>
                          <div className="text-3xl font-bold text-gray-900">
                            {stats?.approvedRequests &&
                              stats?.approvedRequests + stats?.rejectedRequests >
                              0
                              ? Math.round(
                                (stats.approvedRequests /
                                  (stats.approvedRequests +
                                    stats.rejectedRequests)) *
                                100,
                              )
                              : 0}
                            %
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {stats?.approvedRequests || 0} of{" "}
                            {(stats?.approvedRequests || 0) +
                              (stats?.rejectedRequests || 0)}{" "}
                            approved
                          </div>
                        </div>

                        <div className="text-center p-6 bg-gray-50 rounded-sm">
                          <div className="text-sm text-gray-600 mb-2">
                            Average Payment
                          </div>
                          <div className="text-3xl font-bold text-gray-900">
                            ₹
                            {stats?.totalPayments && stats?.totalPayments > 0
                              ? Math.round(
                                stats.totalPaidAmount / stats.totalPayments,
                              )
                              : 0}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Per transaction
                          </div>
                        </div>

                        <div className="text-center p-6 bg-gray-50 rounded-sm">
                          <div className="text-sm text-gray-600 mb-2">
                            Avg. Staff Percentage
                          </div>
                          <div className="text-3xl font-bold text-gray-900">
                            {stats?.totalPayments && stats?.totalPayments > 0
                              ? Math.round(
                                (stats.totalPaidAmount /
                                  stats.totalRequestedAmount) *
                                100,
                              )
                              : 0}
                            %
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Of service price
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pending Requests Section */}
                  {pendingError && (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="pt-6">
                        <p className="text-red-800">
                          Error loading pending requests: {pendingError.message}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2"
                          onClick={() => setActiveTab("requests")}>
                          <Clock className="w-6 h-6" />
                          <span>View All Requests</span>
                          <Badge variant="secondary" className="ml-0">
                            {stats?.pendingRequests || 0}
                          </Badge>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2"
                          onClick={() => setActiveTab("history")}>
                          <Calendar className="w-6 h-6" />
                          <span>View Payment History</span>
                          <Badge variant="secondary" className="ml-0">
                            {stats?.totalPayments || 0}
                          </Badge>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2"
                          onClick={() =>
                            router.push("/provider/dashboard/staff")
                          }>
                          <Users className="w-6 h-6" />
                          <span>Manage Staff</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* REQUESTS TAB */}
            <TabsContent value="requests" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}>
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

              {requestsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : (
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
                              className="border rounded-sm p-4 hover:shadow-md transition-shadow">
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
              )}
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent value="history" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Filters:
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="status">Status:</Label>
                      <Select
                        value={historyStatusFilter}
                        onValueChange={setHistoryStatusFilter}>
                        <SelectTrigger className="w-[180px]" id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="staff">Staff ID:</Label>
                      <Input
                        id="staff"
                        placeholder="Filter by staff..."
                        value={staffFilter}
                        onChange={(e) => setStaffFilter(e.target.value)}
                        className="w-[200px]"
                      />
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {historyLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <div className="text-center py-12">
                        <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No payments found
                        </h3>
                        <p className="text-gray-600">
                          {staffFilter || historyStatusFilter !== "all"
                            ? "Try adjusting your filters."
                            : "No payment records available yet."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment: any) => (
                          <div
                            key={payment.id}
                            className="border rounded-sm p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-semibold text-gray-900">
                                    {payment.serviceName}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={
                                      STATUS_COLORS[
                                      payment.status as keyof typeof STATUS_COLORS
                                      ]
                                    }>
                                    {payment.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <User className="w-4 h-4" />
                                    <div>
                                      <p className="font-medium">
                                        {payment.staffName}
                                      </p>
                                      <p className="text-xs">
                                        {payment.staffMobile}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {payment.paidAt
                                        ? new Date(
                                          payment.paidAt,
                                        ).toLocaleDateString()
                                        : "Pending"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <IndianRupee className="w-4 h-4" />
                                    <span>
                                      Transfer:{" "}
                                      {payment.stripeTransferId || "N/A"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 rounded-sm p-3">
                                  <div className="flex gap-6 text-sm">
                                    <div>
                                      <span className="text-gray-500">
                                        Service Price:
                                      </span>
                                      <span className="ml-2 font-semibold">
                                        ₹{payment.requestedAmount}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Percentage:
                                      </span>
                                      <span className="ml-2 font-semibold">
                                        {payment.percentage}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Staff Received
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                      ₹{payment.staffAmount}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}>
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                          Page {page} of {pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(pagination.totalPages, p + 1),
                            )
                          }
                          disabled={page === pagination.totalPages}>
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
              <div className="bg-gray-50 rounded-sm p-4">
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

              <div className="bg-gray-50 rounded-sm p-4">
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

              {selectedRequest.staffFeedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    Staff Feedback
                  </h4>
                  <p className="text-sm text-blue-800 italic">
                    "{selectedRequest.staffFeedback}"
                  </p>
                </div>
              )}

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
                <div className="bg-green-50 border border-green-200 rounded-sm p-3 space-y-1">
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
              <div className="bg-gray-50 rounded-sm p-4">
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
