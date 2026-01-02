"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CANCELLATION_REASONS = [
  "Change of plans",
  "Booked by mistake",
  "Service no longer needed",
  "Found a better option",
  "Provider requested cancellation",
  "Other",
];

export default function CancelBookingDialog({
  open,
  setOpen,
  selectedBooking,
  handleCancelConfirm,
  isLoading,
}: any) {
  const [reasonType, setReasonType] = useState("");
  const [customReason, setCustomReason] = useState("");

  const isConfirmed = selectedBooking?.bookingStatus === "CONFIRMED";

  const onConfirm = () => {
    if (isLoading) return;

    if (!reasonType) {
      toast.error("Please select a reason.");
      return;
    }

    if (reasonType === "Other" && !customReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    handleCancelConfirm({
      reasonType,
      reason: reasonType === "Other" ? customReason : reasonType,
    });
  };

  const onClose = (state: boolean) => {
    if (!state && !isLoading) {
      setReasonType("");
      setCustomReason("");
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            {isConfirmed ? "Request Cancellation" : "Cancel Booking"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isConfirmed
              ? "Your request will be reviewed by the provider. Refund will be processed after approval or automatically after 7 days."
              : "This booking will be cancelled immediately."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <Label>Reason for cancellation *</Label>

          <RadioGroup
            value={reasonType}
            onValueChange={setReasonType}
            disabled={isLoading}
          >
            {CANCELLATION_REASONS.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r}>{r}</Label>
              </div>
            ))}
          </RadioGroup>

          {reasonType === "Other" && (
            <Textarea
              placeholder="Describe your reason"
              value={customReason}
              disabled={isLoading}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Keep Booking
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading
              ? isConfirmed
                ? "Requesting..."
                : "Cancelling..."
              : isConfirmed
              ? "Request Cancellation"
              : "Confirm Cancellation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
