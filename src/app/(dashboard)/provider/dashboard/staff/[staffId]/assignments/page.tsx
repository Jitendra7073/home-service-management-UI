"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ staffId: string }>;
}

export default function StaffAssignmentsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch staff profile
  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staff", resolvedParams.staffId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/staff/${resolvedParams.staffId}`);
      return res.json();
    },
  });

  // Fetch business services
  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/provider/service");
      return res.json();
    },
  });

  const staff = staffData?.staffProfile;
  const services = servicesData?.services || [];
  const assignments = staff?.serviceAssignments || [];

  const handleAssignService = async () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    setIsAssigning(true);

    try {
      const res = await fetch("/api/provider/staff/assign-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: resolvedParams.staffId,
          serviceId: selectedService,
          skillLevel: "INTERMEDIATE",
          isPrimaryService: false,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Service assigned successfully!");
        window.location.reload();
      } else {
        toast.error(result.msg || "Failed to assign service");
      }
    } catch (error) {
      console.error("Error assigning service:", error);
      toast.error("Failed to assign service");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this service assignment?")) {
      return;
    }

    setIsRemoving(assignmentId);

    try {
      const res = await fetch(`/api/provider/staff/assignment/${assignmentId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Service assignment removed successfully!");
        window.location.reload();
      } else {
        toast.error(result.msg || "Failed to remove assignment");
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast.error("Failed to remove assignment");
    } finally {
      setIsRemoving(null);
    }
  };

  const getAssignedServiceIds = () => {
    return new Set(assignments.map((a: any) => a.serviceId));
  };

  const availableServices = services.filter(
    (s: any) => !getAssignedServiceIds().has(s.id)
  );

  if (staffLoading) {
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

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Staff Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Service Assignments
            </h1>
            <p className="text-gray-600 mt-2">
              Manage which services {staff.user.name} can perform
            </p>
          </div>
        </div>

        {/* Assign New Service */}
        <Card>
          <CardHeader>
            <CardTitle>Assign New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.length > 0 ? (
                      availableServices.map((service: any) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No services available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssignService}
                disabled={!selectedService || isAssigning}
              >
                {isAssigning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Service
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Current Service Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {assignment.service.name}
                        </h3>
                        {assignment.skillLevel && (
                          <Badge className="bg-blue-100 text-blue-700">
                            {assignment.skillLevel}
                          </Badge>
                        )}
                        {assignment.isPrimaryService && (
                          <Badge className="bg-green-100 text-green-700">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>${assignment.service.price}</p>
                        <p>{assignment.service.durationInMinutes} minutes</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      disabled={isRemoving === assignment.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isRemoving === assignment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No services assigned yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Assign services from the dropdown above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
