"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Check, X, Calendar, Mail, Phone, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface PendingStaffRequestsProps {
  isLoading: boolean;
  requests: any[];
}

export default function PendingStaffRequests({
  isLoading,
  requests,
}: PendingStaffRequestsProps) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async ({ staffId, status }: { staffId: string; status: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/${staffId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.msg || "Failed to update status");
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "APPROVED"
          ? "Staff application approved successfully"
          : "Staff application rejected"
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (staffId: string) => {
    approveMutation.mutate({ staffId, status: "APPROVED" });
  };

  const handleReject = (staffId: string) => {
    if (confirm("Are you sure you want to reject this application?")) {
      approveMutation.mutate({ staffId, status: "REJECTED" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No Pending Requests
              </h3>
              <p className="text-sm text-gray-500">
                When staff members apply to join your business, their requests will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {requests.length} pending {requests.length === 1 ? "request" : "requests"}
      </p>

      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {request.user?.photo ? (
                  <img
                    src={request.user.photo}
                    alt={request.user.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm">
                    {request.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.user?.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {request.employmentType === "BUSINESS_BASED" ? "Business Staff" : "Freelancer"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(request.id)}
                      disabled={approveMutation.isPending}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(request.id)}
                      disabled={approveMutation.isPending}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{request.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{request.user?.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>
                      {request.experience || 0} {request.experience === 1 ? "year" : "years"} experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Applied {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Specializations */}
                {request.specialization && request.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {request.specialization.map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
