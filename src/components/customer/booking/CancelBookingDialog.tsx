"use client";

import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Clock,
  Wallet,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ---------------- CONSTANTS ---------------- */

const CANCELLATION_REASONS = [
  "Change of plans",
  "Booked by mistake",
  "Service no longer needed",
  "Emergency",
  "Other",
];

/* ---------------- HELPERS ---------------- */

const formatDuration = (totalMinutes: number) => {
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} min`);

  return parts.join(" ");
};

/* ---------------- COMPONENT ---------------- */

export default function CancelBookingDialog({
  open,
  setOpen,
  selectedBooking,
  handleCancelConfirm,
  isLoading,
}: any) {
  const [reasonType, setReasonType] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!selectedBooking) return null;

  /* ---------------- SERVICE START TIME ---------------- */
  const serviceStart = useMemo(() => {
    if (!selectedBooking.date || !selectedBooking.slot?.time) return null;

    // Parse slot time (e.g., "10:30 AM" or "2:45 PM")
    const [time, modifier] = selectedBooking.slot.time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Create date object with booking date + slot time
    const serviceDate = new Date(selectedBooking.date);
    serviceDate.setHours(hours, minutes, 0, 0);

    return serviceDate;
  }, [selectedBooking]);

  const minutesBeforeService = useMemo(() => {
    if (!serviceStart) return 0;
    return Math.max(
      Math.floor((serviceStart.getTime() - Date.now()) / (1000 * 60)),
      0,
    );
  }, [serviceStart]);

  const hoursBeforeService = useMemo(() => {
    return Math.floor(minutesBeforeService / 60);
  }, [minutesBeforeService]);

  /* ---------------- CANCELLATION POLICY ---------------- */
  const policy = useMemo(() => {
    if (minutesBeforeService >= 1440) {
      return {
        percentage: 0,
        label: "Free cancellation",
        note: "Cancelled more than 24 hours before service.",
      };
    }

    if (minutesBeforeService >= 720) {
      return {
        percentage: 10,
        label: "Low cancellation charge",
        note: "Cancelled 12–24 hours before service.",
      };
    }

    if (minutesBeforeService >= 240) {
      return {
        percentage: 25,
        label: "Moderate cancellation charge",
        note: "Cancelled 4–12 hours before service.",
      };
    }

    return {
      percentage: 50,
      label: "High cancellation charge",
      note: "Cancelled less than 4 hours before service.",
    };
  }, [minutesBeforeService]);

  /* ---------------- AMOUNT CALCULATION ---------------- */
  const cancellationFee =
    selectedBooking.paymentStatus === "PAID"
      ? Math.round((selectedBooking.totalAmount * policy.percentage) / 100)
      : 0;

  const refundAmount =
    selectedBooking.paymentStatus === "PAID"
      ? selectedBooking.totalAmount - cancellationFee
      : 0;

  /* ---------------- CONFIRM HANDLER ---------------- */
  const onConfirm = () => {
    if (!reasonType) {
      toast.error("Please select a reason for cancellation.");
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

  /* ---------------- UI ---------------- */
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] rounded-sm overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <AlertDialogHeader className="flex-shrink-0 pb-3">
          <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5" />
            Cancel Booking
          </AlertDialogTitle>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Service: {selectedBooking.service?.name}
              </p>
              {selectedBooking.business?.name && (
                <p className="text-xs text-gray-500">
                  Provider: {selectedBooking.business.name}
                </p>
              )}
            </div>
            {serviceStart && (
              <div className="text-blue-900 font-semibold text-sm mb-2">
                <p className="text-sm font-semibold text-blue-800">
                  {(() => {
                    const now = new Date();
                    const isToday =
                      serviceStart?.getDate() === now.getDate() &&
                      serviceStart?.getMonth() === now.getMonth() &&
                      serviceStart?.getFullYear() === now.getFullYear();

                    const diffTime = serviceStart?.getTime() - now.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );

                    if (isToday) return "Service Today";
                    if (diffDays === 1) return "1 Day Left";
                    return `${diffDays} Days Left`;
                  })()}
                </p>
              </div>
            )}
          </div>
        </AlertDialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-1 space-y-4">
          {/* Cancellation Policy Card */}
          <div
            className={`rounded-sm border-2 p-3 ${
              policy.percentage === 0
                ? "border-green-200 bg-green-50"
                : policy.percentage <= 10
                ? "border-yellow-200 bg-yellow-50"
                : policy.percentage <= 25
                ? "border-orange-200 bg-orange-50"
                : "border-red-200 bg-red-50"
            }`}>
            <div className="flex items-center justify-between mb-2">
              <div
                className={`flex items-center gap-1.5 font-semibold text-sm ${
                  policy.percentage === 0
                    ? "text-green-800"
                    : policy.percentage <= 10
                    ? "text-yellow-800"
                    : policy.percentage <= 25
                    ? "text-orange-800"
                    : "text-red-800"
                }`}>
                <Wallet className="w-4 h-4" />
                {policy.label}
              </div>
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  policy.percentage === 0
                    ? "text-green-700"
                    : policy.percentage <= 10
                    ? "text-yellow-700"
                    : policy.percentage <= 25
                    ? "text-orange-700"
                    : "text-red-700"
                }`}>
                {policy.percentage}%
              </span>
            </div>

            <p
              className={`text-xs sm:text-sm font-medium ${
                policy.percentage === 0
                  ? "text-green-700"
                  : policy.percentage <= 10
                  ? "text-yellow-700"
                  : policy.percentage <= 25
                  ? "text-orange-700"
                  : "text-red-700"
              }`}>
              {policy.note}
            </p>
          </div>
          {/* Payment Summary Card */}
          {selectedBooking.paymentStatus === "PAID" ? (
            <div className="rounded-sm border-2 border-gray-300 bg-white p-3">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm mb-3">
                <Wallet className="w-4 h-4" />
                Refund Breakdown
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-gray-900">
                    ₹{selectedBooking.totalAmount}
                  </span>
                </div>

                {cancellationFee > 0 && (
                  <div className="flex justify-between items-center text-xs sm:text-sm border-t pt-2">
                    <span className="text-red-600 font-medium">
                      Fee ({policy.percentage}%)
                    </span>
                    <span className="font-bold text-red-600">
                      - ₹{cancellationFee}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs sm:text-sm border-t pt-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">
                    ₹{refundAmount}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border-2 border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 text-sm mb-1">
                    No Payment
                  </p>
                  <p className="text-xs text-blue-700">
                    Cancelled immediately with no charges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reason Selection - Compact */}
          <div className="space-y-2">
            <Label className="text-sm">
              Reason for cancellation <span className="text-red-500">*</span>
            </Label>

            <RadioGroup
              value={reasonType}
              onValueChange={setReasonType}
              className="space-y-2">
              {CANCELLATION_REASONS.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="text-sm cursor-pointer">
                    {r}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {reasonType === "Other" && (
              <Textarea
                placeholder="Please describe your reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="text-sm min-h-[60px]"
              />
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <AlertDialogFooter className="flex-shrink-0 pt-4 mt-2 border-t gap-2">
          <AlertDialogCancel disabled={isLoading} className="text-sm">
            Keep Booking
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-sm">
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
