"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminStaffDetailPage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isRestrictDialogOpen, setIsRestrictDialogOpen] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState("");

  const { data: staff, isLoading } = useQuery({
    queryKey: ["admin-staff-detail", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.msg || "Failed to fetch staff");
      return json.data;
    },
  });

  const restrictMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: restrictionReason }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Staff restricted successfully");
      setIsRestrictDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-detail", staffId],
      });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const liftRestrictionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}/lift-restriction`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Staff restriction lifted");
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-detail", staffId],
      });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  if (isLoading)
    return <div className="p-8 text-center">Loading staff details...</div>;
  if (!staff) return <div className="p-8 text-center">Staff not found</div>;

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-[1200px] px-4 py-8 space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
        </Button>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Card */}
          <Card className="flex-1 w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {staff.name?.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{staff.name}</CardTitle>
                    <p className="text-gray-500 text-sm">Staff Member</p>
                  </div>
                </div>
                <Badge
                  variant={staff.isRestricted ? "destructive" : "default"}
                  className={
                    !staff.isRestricted ? "bg-green-600 hover:bg-green-700" : ""
                  }>
                  {staff.isRestricted ? "Restricted" : "Active"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {staff.email}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {staff.mobile || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Joined {new Date(staff.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Actions</h3>
                {staff.isRestricted ? (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() => liftRestrictionMutation.mutate()}
                    disabled={liftRestrictionMutation.isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Lift Restriction
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => setIsRestrictDialogOpen(true)}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Restrict Staff
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats / Relations */}
          <div className="flex-1 w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Associated Businesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {staff.staffApplications?.length > 0 ? (
                  <div className="space-y-3">
                    {staff.staffApplications.map((app: any) => (
                      <div
                        key={app.id}
                        className="flex justify-between items-center p-3 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {app.businessProfile.businessName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.businessProfile.contactEmail}
                          </p>
                        </div>
                        <Badge variant="outline">{app.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No associated businesses found.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {staff.staffAssignBookings?.length > 0 ? (
                  <div className="space-y-3">
                    {staff.staffAssignBookings.map((assign: any) => (
                      <div key={assign.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {assign.booking.service.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {assign.booking.bookingStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {assign.booking.date}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No bookings assigned recently.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Restrict Dialog */}
      <Dialog
        open={isRestrictDialogOpen}
        onOpenChange={setIsRestrictDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restrict Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to restrict this staff member? They will
              lose access to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Restriction</Label>
              <Textarea
                placeholder="Please provide a reason..."
                value={restrictionReason}
                onChange={(e) => setRestrictionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestrictDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => restrictMutation.mutate()}
              disabled={
                !restrictionReason.trim() || restrictMutation.isPending
              }>
              Restrict Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
