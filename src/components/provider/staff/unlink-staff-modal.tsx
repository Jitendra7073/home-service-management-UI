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
  const [selectedReplacementStaff, setSelectedReplacementStaff] =
    useState<string>("");
  const [bookingTransfers, setBookingTransfers] = useState<BookingTransfer[]>(
    [],
  );
  const [step, setStep] = useState<"check" | "transfer" | "confirm">("check");
  const [ongoingBookings, setOngoingBookings] = useState<any[]>([]);

  const queryClient = useQueryClient();

  // Fetch ongoing bookings for this staff
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["staff-ongoing-bookings", staffId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/${staffId}/bookings`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: isOpen && step === "check",
  });

  // Fetch available staff for replacement
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["provider-staff-replacement", staffId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff?isApproved=true`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    },
    enabled: isOpen && step === "transfer",
  });

  // Unlink staff mutation
  const unlinkMutation = useMutation({
    mutationFn: async (data: {
      staffId: string;
      transfers?: BookingTransfer[];
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/staff/${data.staffId}/unlink`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transfers: data.transfers }),
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
    if (bookingsData?.bookings && step === "check") {
      const activeBookings = bookingsData.bookings.filter(
        (b: any) =>
          b.bookingStatus === "CONFIRMED" &&
          (b.trackingStatus === "BOOKING_STARTED" ||
            b.trackingStatus === "PROVIDER_ON_THE_WAY" ||
            b.trackingStatus === "SERVICE_STARTED" ||
            b.trackingStatus === "PENDING"),
      );
      setOngoingBookings(activeBookings);

      // Initialize booking transfers
      const transfers = activeBookings.map((b: any) => ({
        bookingId: b.id,
        bookingDetails: `${b.service?.name || "Service"} for ${b.user?.name}`,
        newStaffId: "",
      }));
      setBookingTransfers(transfers);

      // Auto-advance if no ongoing bookings
      if (activeBookings.length === 0) {
        setStep("confirm");
      } else {
        setStep("transfer");
      }
    }
  }, [bookingsData, step]);

  const handleAssignStaffToBooking = (
    bookingId: string,
    newStaffId: string,
  ) => {
    setBookingTransfers((prev) =>
      prev.map((bt) =>
        bt.bookingId === bookingId ? { ...bt, newStaffId } : bt,
      ),
    );
  };

  const handleApplyToAll = () => {
    if (selectedReplacementStaff) {
      setBookingTransfers((prev) =>
        prev.map((bt) => ({ ...bt, newStaffId: selectedReplacementStaff })),
      );
    }
  };

  const canProceedToConfirm = () => {
    return bookingTransfers.every((bt) => bt.newStaffId !== "");
  };

  const handleUnlinkStaff = () => {
    unlinkMutation.mutate({
      staffId,
      transfers: ongoingBookings.length > 0 ? bookingTransfers : undefined,
    });
  };

  const resetModal = () => {
    setStep("check");
    setOngoingBookings([]);
    setBookingTransfers([]);
    setSelectedReplacementStaff("");
    onClose();
  };

  const availableStaff =
    staffData?.staffProfiles?.filter(
      (s: any) => s.id !== staffId && s.availability === "AVAILABLE",
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Unlink Staff from Business
          </DialogTitle>
          <DialogDescription>
            {step === "check" && "Checking for ongoing bookings..."}
            {step === "transfer" &&
              "Transfer ongoing bookings to another staff member"}
            {step === "confirm" && "Confirm unlink action"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingBookings && step === "check" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Show ongoing bookings */}
            {step === "transfer" && ongoingBookings.length > 0 && (
              <>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{staffName}</strong> has{" "}
                    <strong>{ongoingBookings.length}</strong> ongoing{" "}
                    {ongoingBookings.length === 1 ? "booking" : "bookings"} that
                    need to be transferred to another staff member before
                    unlinking.
                  </AlertDescription>
                </Alert>

                {/* Quick assign all */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label
                    htmlFor="assign-all"
                    className="text-sm font-medium whitespace-nowrap">
                    Assign all bookings to:
                  </Label>
                  <Select
                    value={selectedReplacementStaff}
                    onValueChange={setSelectedReplacementStaff}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStaff.map((staff: any) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApplyToAll}
                    disabled={!selectedReplacementStaff}>
                    Apply to All
                  </Button>
                </div>

                {/* Individual booking transfers */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Transfer Bookings
                  </Label>
                  {bookingTransfers.map((transfer, index) => {
                    const booking = ongoingBookings[index];
                    return (
                      <div
                        key={transfer.bookingId}
                        className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {transfer.bookingDetails}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {booking.slot?.date &&
                              new Date(booking.slot.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Select
                          value={transfer.newStaffId}
                          onValueChange={(value) =>
                            handleAssignStaffToBooking(
                              transfer.bookingId,
                              value,
                            )
                          }>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select replacement staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStaff.map((staff: any) => (
                              <SelectItem key={staff.id} value={staff.id}>
                                <div className="flex items-center gap-2">
                                  <span>{staff.user.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {staff.availability === "AVAILABLE"
                                      ? "• Available"
                                      : "• Busy"}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2: Confirm */}
            {step === "confirm" && (
              <div className="space-y-4">
                {ongoingBookings.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      <strong>{staffName}</strong> has no ongoing bookings. You
                      can safely unlink them from your business. Their account
                      will not be deleted, but they will no longer be associated
                      with your business.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertDescription>
                      All bookings have been assigned to new staff members.
                      Review the transfer details below before confirming.
                    </AlertDescription>
                  </Alert>
                )}

                {ongoingBookings.length > 0 && (
                  <div className="p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold">
                      Booking Transfer Summary:
                    </p>
                    {bookingTransfers.map((transfer, index) => {
                      const booking = ongoingBookings[index];
                      const newStaff = availableStaff.find(
                        (s: any) => s.id === transfer.newStaffId,
                      );
                      return (
                        <div
                          key={transfer.bookingId}
                          className="text-sm flex justify-between">
                          <span className="text-gray-600">
                            {transfer.bookingDetails}
                          </span>
                          <span className="font-medium">
                            → {newStaff?.user.name || "Not assigned"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This action cannot be undone. <strong>{staffName}</strong>{" "}
                    will lose access to your business and all associated
                    services.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={resetModal}
            disabled={unlinkMutation.isPending}>
            Cancel
          </Button>
          {step === "transfer" && (
            <Button
              onClick={() => setStep("confirm")}
              disabled={!canProceedToConfirm() || isLoadingBookings}>
              Review Transfers
            </Button>
          )}
          {step === "confirm" && (
            <Button
              variant="destructive"
              onClick={handleUnlinkStaff}
              disabled={unlinkMutation.isPending}>
              {unlinkMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Confirm Unlink Staff"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
