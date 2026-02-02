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
      if (approvalFilter) params.append("isApproved", approvalFilter);

      const res = await fetch(`/api/admin/staff?${params}`);
      return res.json();
    },
  });

  const staffProfiles = data?.staffProfiles || [];

  // Calculate stats
  const totalStaff = staffProfiles.length;
  const activeStaff = staffProfiles.filter((s: any) => s.isActive).length;
  const businessBased = staffProfiles.filter(
    (s: any) => s.employmentType === "BUSINESS_BASED",
  ).length;
  const globalFreelancers = staffProfiles.filter(
    (s: any) => s.employmentType === "GLOBAL_FREELANCE",
  ).length;
  const pendingApproval = staffProfiles.filter(
    (s: any) => s.employmentType === "GLOBAL_FREELANCE" && !s.isApproved,
  ).length;

  const getStatusColor = (
    isActive: boolean,
    isApproved: boolean,
    employmentType: string,
  ) => {
    if (!isActive) return "bg-red-100 text-red-700";
    if (employmentType === "GLOBAL_FREELANCE" && !isApproved)
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (
    isActive: boolean,
    isApproved: boolean,
    employmentType: string,
  ) => {
    if (!isActive) return "Inactive";
    if (employmentType === "GLOBAL_FREELANCE" && !isApproved)
      return "Pending Approval";
    return "Active";
  };

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-50">
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
                <div className="p-3 bg-blue-100 rounded-full">
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
                <div className="p-3 bg-green-100 rounded-full">
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
                    Business-Based
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {businessBased}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
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
                    Global Freelancers
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {globalFreelancers}
                  </p>
                  {pendingApproval > 0 && (
                    <span className="text-sm text-orange-600">
                      ({pendingApproval} pending)
                    </span>
                  )}
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approval Alert */}
        {pendingApproval > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-700" />
                  <div>
                    <p className="font-semibold text-yellow-900">
                      {pendingApproval} Global Freelancer
                      {pendingApproval > 1 ? "s" : ""} Pending Approval
                    </p>
                    <p className="text-sm text-yellow-700">
                      Review and approve global freelancer applications
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/staff/pending")}
                  className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                  Review Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
              <SelectItem value="BUSINESS_BASED">Business-Based</SelectItem>
              <SelectItem value="GLOBAL_FREELANCE">
                Global Freelancers
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading staff data...
                    </TableCell>
                  </TableRow>
                ) : staffProfiles.length > 0 ? (
                  staffProfiles.map((staff: any) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {staff.photo ? (
                            <img
                              src={staff.photo}
                              alt={staff.user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {staff.user.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">{staff.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            staff.employmentType === "BUSINESS_BASED"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }>
                          {staff.employmentType === "BUSINESS_BASED"
                            ? "Business"
                            : "Freelancer"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {staff.businessProfile?.businessName || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {staff.specialization
                            ?.slice(0, 2)
                            .map((spec: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          {(staff.specialization?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{staff.specialization.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {staff.analytics?.applicationsCount || 0}
                          </div>
                          {staff.employmentType === "GLOBAL_FREELANCE" && (
                            <div className="text-xs text-muted-foreground">
                              applied
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {staff._count?.bookings || 0}
                          </div>
                          {(staff.analytics?.completedBookings || 0) > 0 && (
                            <div className="text-xs text-green-600">
                              {staff.analytics.completedBookings} completed
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            ${(staff.analytics?.totalEarnings || 0) / 100}
                          </div>
                          {(staff.analytics?.pendingEarnings || 0) > 0 && (
                            <div className="text-xs text-orange-600">
                              ${staff.analytics.pendingEarnings / 100} pending
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            staff.isActive,
                            staff.isApproved,
                            staff.employmentType,
                          )}>
                          {getStatusText(
                            staff.isActive,
                            staff.isApproved,
                            staff.employmentType,
                          )}
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
                    <TableCell colSpan={10} className="text-center py-8">
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
