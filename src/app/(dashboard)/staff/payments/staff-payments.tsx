"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffPaymentsSkeleton } from "@/components/staff/skeletons";
import { toast } from "sonner";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_ICONS = {
  PENDING: Clock,
  PAID: CheckCircle2,
  FAILED: XCircle,
  CANCELLED: XCircle,
};

export function StaffPaymentsClient() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["staff-payments", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      params.append("page", page.toString());
      params.append("limit", "20");

      const res = await fetch(`/api/staff/payments/history?${params}`, {
        credentials: "include",
      });
      const result = await res.json();
      return result;
    },
  });

  // Check Stripe account status
  const { data: stripeData } = useQuery({
    queryKey: ["staff-stripe-status"],
    queryFn: async () => {
      const res = await fetch("/api/staff/payments/stripe/status", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const payments = data?.payments || [];
  const pagination = data?.pagination;

  const calculateTotalEarnings = () => {
    return payments
      .filter((p: any) => p.status === "PAID")
      .reduce((sum: number, p: any) => sum + p.staffAmount, 0);
  };

  const totalEarnings = calculateTotalEarnings();

  if (isLoading) {
    return <StaffPaymentsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">
                Error loading payment history. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">
            Track your earnings and payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-900">
                  ₹{totalEarnings}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-900">
                  {payments.filter((p: any) => p.status === "PAID").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-900">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-8 h-8 text-yellow-600" />
                <span className="text-3xl font-bold text-yellow-900">
                  {payments.filter((p: any) => p.status === "PENDING").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stripe Account Status */}
        {stripeData?.success && (
          <Card
            className={
              stripeData.hasConnected
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-sm ${
                      stripeData.hasConnected ? "bg-green-100" : "bg-amber-100"
                    }`}>
                    <CreditCard
                      className={`w-6 h-6 ${
                        stripeData.hasConnected
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        stripeData.hasConnected
                          ? "text-green-900"
                          : "text-amber-900"
                      }`}>
                      Stripe Account Status
                    </h3>
                    <p
                      className={`text-sm ${
                        stripeData.hasConnected
                          ? "text-green-700"
                          : "text-amber-700"
                      }`}>
                      {stripeData.hasConnected
                        ? "Connected - Ready to receive payments"
                        : "Not Connected - Connect to receive payments"}
                    </p>
                  </div>
                </div>
                {!stripeData.hasConnected && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      toast.info("Redirecting to Stripe...", {
                        description:
                          "You'll be redirected to complete your account setup",
                      });
                      setTimeout(() => {
                        window.location.href = "/staff/profile?tab=payment";
                      }, 1000);
                    }}>
                    Connect Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
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
                  {statusFilter === "all"
                    ? "You haven't received any payments yet."
                    : `No ${statusFilter.toLowerCase()} payments found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment: any) => {
                  const StatusIcon =
                    STATUS_ICONS[payment.status as keyof typeof STATUS_ICONS];
                  return (
                    <div
                      key={payment.id}
                      className="border rounded-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {payment.booking?.service?.name || "Service"}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                STATUS_COLORS[
                                  payment.status as keyof typeof STATUS_COLORS
                                ]
                              }>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span>{payment.providerName}</span>
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
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Requested:
                                </span>
                                <span className="ml-2 font-semibold">
                                  ₹{payment.requestedAmount}
                                </span>
                              </div>
                              {payment.percentage && (
                                <div>
                                  <span className="text-gray-500">
                                    Percentage:
                                  </span>
                                  <span className="ml-2 font-semibold">
                                    {payment.percentage}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                You Received
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                ₹{payment.staffAmount}
                              </p>
                            </div>
                          </div>

                          {payment.stripeTransferId && (
                            <div className="mt-2 text-xs text-gray-500">
                              Transfer ID: {payment.stripeTransferId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
