"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  IndianRupee,
  Calendar,
  User,
  CheckCircle2,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

export function ProviderPaymentHistoryClient() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-payment-history", statusFilter, staffFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
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
      const result = await res.json();
      return result;
    },
  });

  const payments = data?.payments || [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  const handleExport = () => {
    toast.success("Export feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-6xl px-4 py-8">
          <Loader2 className="animate-spin w-8 h-8 mx-auto" />
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">
            View all processed staff payments
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-900">
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-8 h-8 text-green-600" />
                  <span className="text-3xl font-bold text-green-900">
                    ₹{stats.totalPaid}
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
                  <IndianRupee className="w-8 h-8 text-yellow-600" />
                  <span className="text-3xl font-bold text-yellow-900">
                    ₹{stats.totalPending}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-900">
                    {stats.totalTransactions}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  {staffFilter || statusFilter !== "all"
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
                              <p className="font-medium">{payment.staffName}</p>
                              <p className="text-xs">{payment.staffMobile}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {payment.paidAt
                                ? new Date(payment.paidAt).toLocaleDateString()
                                : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <IndianRupee className="w-4 h-4" />
                            <span>
                              Transfer: {payment.stripeTransferId || "N/A"}
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
                              <span className="text-gray-500">Percentage:</span>
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
