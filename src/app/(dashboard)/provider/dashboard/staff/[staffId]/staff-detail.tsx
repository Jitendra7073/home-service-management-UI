"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Briefcase, Mail, Phone, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StaffStatsCards from "@/components/provider/staff/staff-stats-cards";

interface StaffDetailProps {
  staffId: string;
}

export default function StaffDetail({ staffId }: StaffDetailProps) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/staff/${staffId}`);
      return res.json();
    },
  });

  const staff = data?.staffProfile;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex w-full justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl px-4 py-8">
          <p className="text-gray-600">Staff member not found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const res = await fetch(`/api/provider/staff/${staffId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert("Staff deleted successfully");
        router.push("/provider/dashboard/staff");
      } else {
        alert(data.msg || "Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/provider/dashboard/staff/${staffId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    alt={staff.user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {staff.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {staff.user.name}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        className={
                          staff.employmentType === "BUSINESS_BASED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      >
                        {staff.employmentType === "BUSINESS_BASED"
                          ? "Business Staff"
                          : "Global Freelancer"}
                      </Badge>
                      <Badge
                        className={
                          staff.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {staff.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {staff.employmentType === "GLOBAL_FREELANCE" && (
                        <Badge
                          className={
                            staff.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {staff.isApproved ? "Approved" : "Pending Approval"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{staff.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.user.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      {staff.experience || 0}{" "}
                      {staff.experience === 1 ? "year" : "years"} experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {staff.bio && (
                  <p className="mt-4 text-gray-700">{staff.bio}</p>
                )}

                {/* Specializations */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {staff.specialization.map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff._count?.bookings || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff._count?.serviceAssignments || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staff.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => router.push(`/provider/dashboard/staff/${staffId}/assignments`)}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Manage Services</p>
              <p className="text-sm text-gray-600">
                Assign or remove services for this staff member
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => router.push(`/provider/dashboard/staff/${staffId}/availability`)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Manage Availability</p>
              <p className="text-sm text-gray-600">
                Set working hours and time off
              </p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
