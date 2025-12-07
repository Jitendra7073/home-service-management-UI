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
import { toast } from "sonner";

export default function CancelBookingDialog({
    open,
    setOpen,
    selectedBooking,
    handleCancelConfirm,
}: any) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const onConfirm = () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for cancellation.");
            return;
        }

        handleCancelConfirm(reason);
        setReason("");
        setError("");
    };

    const onClose = (state: boolean) => {
        if (!state) {
            setReason("");
            setError("");
        }
        setOpen(state);
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this booking for{" "}
                        <span className="font-semibold">{selectedBooking?.service.name}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Reason Textarea */}
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Reason for Cancellation <span className="text-red-500">*</span>
                    </label>

                    <Textarea
                        placeholder="Write your reason..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError("");
                        }}
                        className="min-h-[90px] border-gray-300"
                    />

                    {error && (
                        <p className="text-red-600 text-xs mt-1">{error}</p>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Yes, Cancel Booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
