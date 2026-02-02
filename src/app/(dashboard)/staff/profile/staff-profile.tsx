"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StaffProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["staff-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
  });

  // API returns: { success, msg, user }
  const staff = data?.user;

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ---------------- EMPTY STATE ----------------
  if (!staff) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-7xl px-4 py-8">
          <p className="text-gray-600">Profile not found.</p>
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and availability
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    alt={staff.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {staff.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {staff.name}
                    </h2>

                    <div className="flex items-center gap-3 flex-wrap mt-2">
                      <Badge className="bg-blue-100 text-blue-700">
                        {staff.role === "staff" ? "Staff Member" : "User"}
                      </Badge>

                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{staff.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.mobile}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      Subscription:{" "}
                      {staff.providerSubscription
                        ? staff.providerSubscription.planName
                        : "Not Active"}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        {staff.businessProfile && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Business Information
              </h3>

              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Business:</span>{" "}
                  {staff.businessProfile.businessName}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span>{" "}
                  {staff.businessProfile.contactEmail}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => (window.location.href = "/staff/availability")}>
            <Calendar className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Manage Availability</p>
              <p className="text-sm text-gray-600">Set your working hours</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => (window.location.href = "/staff/earnings")}>
            <Briefcase className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">View Earnings</p>
              <p className="text-sm text-gray-600">Track your income</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
