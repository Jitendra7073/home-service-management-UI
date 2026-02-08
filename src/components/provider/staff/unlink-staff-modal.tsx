"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, UserCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface UnlinkStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
}

interface BookingTransfer {
  bookingId: string;
  bookingDetails: string;
  newStaffId: string;
}

export function UnlinkStaffModal({
  isOpen,
  onClose,
  staffId,
  staffName,
}: UnlinkStaffModalProps) {
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"check" | "blocked" | "confirm">("check");
  const [ongoingBookings, setOngoingBookings] = useState<any[]>([]);

  const queryClient = useQueryClient();

  // Fetch ongoing bookings for this staff
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["staff-ongoing-bookings", staffId],
    queryFn: async () => {
      const res = await fetch(
        `/api/provider/staff/${staffId}/bookings`, // Use proxy or direct if configured
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: isOpen,
  });

  // Unlink staff mutation
  const unlinkMutation = useMutation({
    mutationFn: async (data: { staffId: string; reason: string }) => {
      const res = await fetch(
        `/api/provider/staff/${data.staffId}/unlink`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: data.reason }),
        },
      );
      const result = await res.json();
      if (!result.success)
        throw new Error(result.msg || "Failed to unlink staff");
      return result;
    },
    onSuccess: () => {
      toast.success("Staff unlinked successfully");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
      // Navigate back to staff list
      window.location.href = "/provider/dashboard/staff";
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (bookingsData?.bookings && isOpen) {
      const activeBookings = bookingsData.bookings.filter(
        (b: any) =>
          b.bookingStatus === "CONFIRMED" &&
          (b.trackingStatus === "BOOKING_STARTED" ||
            b.trackingStatus === "PROVIDER_ON_THE_WAY" ||
            b.trackingStatus === "SERVICE_STARTED" ||
            b.trackingStatus === "PENDING"),
      );
      setOngoingBookings(activeBookings);

      if (activeBookings.length > 0) {
        setStep("blocked");
      } else {
        setStep("confirm");
      }
    }
  }, [bookingsData, isOpen]);

  const handleUnlinkStaff = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for unlinking.");
      return;
    }
    unlinkMutation.mutate({
      staffId,
      reason,
    });
  };

  const resetModal = () => {
    setStep("check");
    setOngoingBookings([]);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <UserCircle className="w-5 h-5" />
            Unlink Staff Member
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{staffName}</strong> from
            your business?
          </DialogDescription>
        </DialogHeader>

        {isLoadingBookings ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">
              Checking for ongoing bookings...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* BLOCKED STATE */}
            {step === "blocked" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <p>Cannot unlink staff member. <strong>{staffName}</strong> has
                      <strong>{ongoingBookings.length}</strong> ongoing booking(s)
                      that must be completed first.</p>
                  </AlertDescription>
                </Alert>

                <div className="border rounded-sm divide-y max-h-60 overflow-y-auto">
                  {ongoingBookings.map((booking: any) => (
                    <div key={booking.id} className="p-3 text-sm">
                      <div className="flex justify-between font-medium">
                        <span>{booking.service?.name}</span>
                        <span className="text-gray-500">
                          {booking.slot?.time}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Customer: {booking.user?.name}
                      </div>
                      <div className="text-xs mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded inline-block">
                        {booking.trackingStatus.replace(/_/g, " ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIRM STATE */}
            {step === "confirm" && (
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertDescription>
                    No ongoing bookings found. You can proceed with unlinking.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Reason for Unlinking <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="reason"
                    className="flex min-h-[80px] w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Please explain why you are removing this staff member..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    This reason will be visible to the staff member.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={resetModal}
            disabled={unlinkMutation.isPending}>
            {step === "blocked" ? "Close" : "Cancel"}
          </Button>

          {step === "confirm" && (
            <Button
              variant="destructive"
              onClick={handleUnlinkStaff}
              disabled={unlinkMutation.isPending || !reason.trim()}>
              {unlinkMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Confirm & Unlink"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
