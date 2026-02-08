"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Filter, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StaffEarningsSkeleton } from "@/components/staff/skeletons";

export default function StaffEarnings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") || "";

  // Initialize filter from URL
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(statusParam);

  // Handle filter change and update URL
  const handleFilterChange = (value: string) => {
    setPaymentStatusFilter(value);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    // Update URL without refreshing
    router.push(`/staff/earnings?${params.toString()}`, { scroll: false });
  };

  // Fetch earnings data
  const { data, isLoading } = useQuery({
    queryKey: ["staff-earnings", paymentStatusFilter],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (paymentStatusFilter && paymentStatusFilter !== "ALL") {
        queryParams.set("paymentStatus", paymentStatusFilter);
      }
      const res = await fetch(`/api/staff/earnings?${queryParams}`, {
        method: "GET",
      });
      return res.json();
    },
  });

  const earnings = data?.earnings || [];

  // Show skeleton while loading
  if (isLoading) {
    return <StaffEarningsSkeleton />;
  }

  const totalEarnings = earnings
    .filter((e: any) => e.paymentStatus === "PAID")
    .reduce((sum: number, e: any) => sum + e.staffShare, 0);

  const pendingPayments = earnings
    .filter((e: any) => e.paymentStatus === "PENDING")
    .reduce((sum: number, e: any) => sum + e.staffShare, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Earnings</h1>
        <p className="text-gray-600 mt-2">
          Track your earnings and payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-sm">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-sm">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{pendingPayments.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <Select
                value={paymentStatusFilter || "ALL"}
                onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Filter by payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Payments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          ) : earnings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Your Share</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((earning: any) => (
                  <TableRow key={earning.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(earning.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {earning.booking?.service?.name || "Service"}
                    </TableCell>
                    <TableCell>${earning.totalAmount}</TableCell>
                    <TableCell>${earning.platformFee}</TableCell>
                    <TableCell className="font-semibold">
                      ${earning.staffShare}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-sm text-xs font-medium ${getStatusColor(
                          earning.paymentStatus,
                        )}`}>
                        {earning.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {earning.paidAt ? formatDate(earning.paidAt) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <IndianRupee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No earnings found</p>
              <p className="text-sm text-gray-500 mt-2">
                Your earnings will appear here once you complete bookings
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
