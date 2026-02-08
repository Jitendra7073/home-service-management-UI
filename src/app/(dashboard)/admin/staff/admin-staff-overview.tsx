"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Globe, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function AdminStaffOverview() {
  const router = useRouter();
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-staff", employmentTypeFilter, approvalFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (employmentTypeFilter)
        params.append("employmentType", employmentTypeFilter);
      if (approvalFilter) params.append("status", approvalFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/staff?${params}`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
  });

  const staffMembers = data?.data || [];

  // Calculate stats
  const totalStaff = data?.pagination?.total || 0;
  const activeStaff = staffMembers.filter((s: any) => !s.isRestricted).length;
  // Note: Backend doesn't distinguish "Business Based" vs "Freelance" easily without more schema info
  // Assuming all are "Business Based" for now if they have applications.
  const businessBased = staffMembers.filter(
    (s: any) => s.associatedBusinesses > 0,
  ).length;
  const globalFreelancers = totalStaff - businessBased; // Fallback
  const pendingApproval = 0; // Backend doesn't return pending apps count per staff yet easily

  const getStatusColor = (isRestricted: boolean) => {
    if (isRestricted) return "bg-red-100 text-red-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (isRestricted: boolean) => {
    if (isRestricted) return "Restricted";
    return "Active";
  };

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-[1600px] px-2 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">
            Platform-wide oversight of all staff members
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    Total Staff
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {totalStaff}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Active Staff
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {activeStaff}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-sm">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">
                    Business-Associated
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {businessBased}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-sm">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">
                    Independent
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {globalFreelancers}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-sm">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <Select
            value={employmentTypeFilter}
            onValueChange={setEmploymentTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {/* Note: Filtering by type not fully supported in backend getAllStaff yet without schema update */}
            </SelectContent>
          </Select>

          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Staff Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Associated Businesses</TableHead>
                  <TableHead>Total Bookings</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading staff data...
                    </TableCell>
                  </TableRow>
                ) : staffMembers.length > 0 ? (
                  staffMembers.map((staff: any) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {staff.name.charAt(0)}
                          </div>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {staff.associatedBusinesses || "-"}
                        </span>
                      </TableCell>
                      <TableCell>{staff.totalBookings || 0}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${staff.completionRate >= 80
                              ? "text-green-600"
                              : staff.completionRate >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}>
                          {staff.completionRate || 0}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {staff.averageRating || 0}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({staff.reviewCount || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ₹{staff.totalEarnings || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(staff.isRestricted)}>
                          {getStatusText(staff.isRestricted)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/staff/${staff.id}`)
                          }>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No staff found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Import Briefcase icon
import { Briefcase } from "lucide-react";
