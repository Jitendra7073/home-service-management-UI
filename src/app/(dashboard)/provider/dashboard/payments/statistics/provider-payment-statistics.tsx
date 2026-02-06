"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function ProviderPaymentStatisticsClient() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-payment-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/payments/stats`,
        {
          credentials: "include",
        },
      );
      const result = await res.json();
      return result;
    },
  });

  const stats = data?.stats;

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
                Error loading statistics. Please try again later.
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
            Payment Statistics
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of your staff payment activity
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending Requests */}
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
              <div className="text-4xl font-bold text-yellow-900 mb-1">
                {stats?.pendingRequests || 0}
              </div>
              <p className="text-sm text-yellow-700">Awaiting your review</p>
            </CardContent>
          </Card>

          {/* Approved Requests */}
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
              <div className="text-4xl font-bold text-green-900 mb-1">
                {stats?.approvedRequests || 0}
              </div>
              <p className="text-sm text-green-700">Successfully processed</p>
            </CardContent>
          </Card>

          {/* Rejected Requests */}
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
              <div className="text-4xl font-bold text-red-900 mb-1">
                {stats?.rejectedRequests || 0}
              </div>
              <p className="text-sm text-red-700">Declined payments</p>
            </CardContent>
          </Card>

          {/* Total Payments */}
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
              <div className="text-4xl font-bold text-blue-900 mb-1">
                {stats?.totalPayments || 0}
              </div>
              <p className="text-sm text-blue-700">Completed transactions</p>
            </CardContent>
          </Card>

          {/* Total Paid Amount */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow col-span-1 md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-emerald-900">
                  Total Amount Paid to Staff
                </CardTitle>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-emerald-900 mb-1">
                ₹{stats?.totalPaidAmount || 0}
              </div>
              <p className="text-sm text-emerald-700">Across all payments</p>
            </CardContent>
          </Card>

          {/* Total Requested */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow col-span-1 md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Total Requested Amount
                </CardTitle>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-purple-900 mb-1">
                ₹{stats?.totalRequestedAmount || 0}
              </div>
              <p className="text-sm text-purple-700">
                Sum of all payment requests
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
              {/* Approval Rate */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Approval Rate</div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.approvedRequests &&
                  stats?.approvedRequests + stats?.rejectedRequests > 0
                    ? Math.round(
                        (stats.approvedRequests /
                          (stats.approvedRequests + stats.rejectedRequests)) *
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

              {/* Average Payment */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  Average Payment
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹
                  {stats?.totalPayments && stats?.totalPayments > 0
                    ? Math.round(stats.totalPaidAmount / stats.totalPayments)
                    : 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per transaction
                </div>
              </div>

              {/* Staff Percentage */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  Avg. Staff Percentage
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.totalPayments && stats?.totalPayments > 0
                    ? Math.round(
                        (stats.totalPaidAmount / stats.totalRequestedAmount) *
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
                onClick={() =>
                  router.push("/provider/dashboard/payments/requests")
                }>
                <Clock className="w-6 h-6" />
                <span>View Pending Requests</span>
                <Badge variant="secondary" className="ml-0">
                  {stats?.pendingRequests || 0}
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() =>
                  router.push("/provider/dashboard/payments/history")
                }>
                <Calendar className="w-6 h-6" />
                <span>View Payment History</span>
                <Badge variant="secondary" className="ml-0">
                  {stats?.totalPayments || 0}
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => router.push("/provider/dashboard/staff")}>
                <Users className="w-6 h-6" />
                <span>Manage Staff</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
