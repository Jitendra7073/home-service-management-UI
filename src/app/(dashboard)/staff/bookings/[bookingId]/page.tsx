"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  CheckCircle2,
  Circle,
  Loader2,
  IndianRupee,
  Send,
  AlertTriangle,
  XCircle,
  Hourglass,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { StaffBookingDetailSkeleton } from "@/components/staff/skeletons";
import { StripeConnectModal } from "@/components/staff/stripe-connect-modal";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

const STEPS = [
  { key: "NOT_STARTED", label: "Start Service", icon: Circle },
  { key: "BOOKING_STARTED", label: "On the Way", icon: Clock },
  { key: "PROVIDER_ON_THE_WAY", label: "Started", icon: Circle },
  { key: "SERVICE_STARTED", label: "Completed", icon: CheckCircle2 },
  { key: "COMPLETED", label: "Thank You", icon: CheckCircle2 },
];

export default function StaffBookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [earlyStartReason, setEarlyStartReason] = useState("");
  const [staffFeedback, setStaffFeedback] = useState("");
  const [isRequestingPayment, setIsRequestingPayment] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["staff-booking", resolvedParams.bookingId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/bookings`,
        {
          credentials: "include",
        },
      );
      const result = await res.json();
      return result.bookings?.find(
        (b: any) => b.id === resolvedParams.bookingId,
      );
    },
    enabled: !!resolvedParams.bookingId,
  });

  const booking = data;

  // Fetch payment status for this booking
  const { data: paymentStatusData } = useQuery({
    queryKey: ["booking-payment-status", resolvedParams.bookingId],
    queryFn: async () => {
      const res = await fetch(
        `/api/staff/payments/booking/${resolvedParams.bookingId}/status`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
    enabled:
      !!resolvedParams.bookingId && booking?.trackingStatus === "COMPLETED",
  });

  // Check staff's Stripe account status
  const { data: stripeStatusData } = useQuery({
    queryKey: ["staff-stripe-status"],
    queryFn: async () => {
      const res = await fetch("/api/staff/payments/stripe/status", {
        credentials: "include",
      });
      return res.json();
    },
    enabled: !!booking,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTrackingUpdate = async (nextStatus: string, reason?: string) => {
    setIsUpdating(true);
    try {
      const body: any = { status: nextStatus };
      if (reason) {
        body.earlyStartReason = reason;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/bookings/${resolvedParams.bookingId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const result = await res.json();

      if (result.success) {
        toast.success(`Status updated successfully`);
        window.location.reload();
      } else if (result.bookingCancelled) {
        // Booking is cancelled by customer
        toast.error(
          result.msg ||
          "Cannot update tracking status. This booking has been cancelled by the customer.",
        );
        setIsUpdating(false);
      } else if (result.requireReason) {
        // Show reason dialog
        setPendingStatus(nextStatus);
        setShowReasonDialog(true);
        setIsUpdating(false);
      } else {
        toast.error(result.msg || "Failed to update status");
        setIsUpdating(false);
      }
    } catch (e) {
      toast.error("Error updating status");
      setIsUpdating(false);
    }
  };

  const handleSubmitReason = () => {
    if (!earlyStartReason.trim()) {
      toast.error("Please provide a reason for starting early");
      return;
    }
    setShowReasonDialog(false);
    if (pendingStatus) {
      handleTrackingUpdate(pendingStatus, earlyStartReason);
    }
  };

  const handleRequestPayment = async () => {
    setIsRequestingPayment(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/payments/request`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: resolvedParams.bookingId,
            staffFeedback: staffFeedback.trim() || undefined,
          }),
        },
      );
      const result = await res.json();

      if (result.success) {
        toast.success("Payment request submitted successfully!");
        setShowPaymentDialog(false);
        setStaffFeedback("");
        // Optional: reload page to update UI state
        setTimeout(() => window.location.reload(), 1000);
      } else if (result.requirement === "stripeAccount") {
        // Show Stripe connection modal if account not connected
        setShowPaymentDialog(false);
        setShowStripeModal(true);
      } else {
        toast.error(result.msg || "Failed to submit payment request");
      }
    } catch (e) {
      toast.error("Error submitting payment request");
    } finally {
      setIsRequestingPayment(false);
    }
  };

  const getStepIndex = (status: string) => {
    return STEPS.findIndex((step) => step.key === status);
  };

  const currentStepIndex = getStepIndex(
    booking?.trackingStatus || "NOT_STARTED",
  );

  const renderStepper = () => {
    const isBookingCancelled = booking?.bookingStatus === "CANCELLED";

    // If booking is cancelled, show a special cancellation stepper
    if (isBookingCancelled) {
      return (
        <div className="mb-8">
          <div className="flex items-center justify-center p-6 bg-red-50 border-2 border-red-200 rounded-sm">
            <XCircle className="w-12 h-12 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">
                Booking Cancelled
              </h3>
              <p className="text-sm text-red-700">
                This booking has been cancelled by the customer. Tracking
                updates are disabled.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10 rounded" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-10 rounded transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                    }`}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium text-center ${isCurrent
                    ? "text-blue-600"
                    : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                    }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    const currentStatus = booking?.trackingStatus || "NOT_STARTED";
    const isBookingCancelled = booking?.bookingStatus === "CANCELLED";
    const paymentStatus = paymentStatusData?.paymentRequest;
    const payment = paymentStatusData?.payment;
    const hasRequested = paymentStatusData?.hasRequested;
    const isPaid = paymentStatusData?.isPaid;

    // Show cancellation alert if booking is cancelled
    if (isBookingCancelled) {
      return (
        <div className="space-y-3">
          <div className="text-center p-6 bg-red-50 border border-red-200 rounded-sm">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Booking Cancelled by Customer
            </h3>
            <p className="text-red-700">
              This booking has been cancelled by the customer. You cannot update
              the tracking status.
            </p>
          </div>
        </div>
      );
    }

    if (currentStatus === "COMPLETED") {
      // Payment status display
      if (isPaid || payment?.status === "PAID") {
        return (
          <div className="space-y-3">
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-sm">
              <BadgeCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Payment Received!
              </h3>
              <p className="text-green-700 font-medium text-xl mb-2">
                ₹{payment?.staffAmount || 0}
              </p>
              <p className="text-sm text-green-600">
                Paid on {new Date(payment?.paidAt || "").toLocaleDateString()}
              </p>
              {payment?.stripeTransferId && (
                <p className="text-xs text-gray-500 mt-2">
                  Transfer ID: {payment.stripeTransferId}
                </p>
              )}
            </div>
          </div>
        );
      }

      // Payment pending
      if (paymentStatus?.requestStatus === "PENDING") {
        return (
          <div className="space-y-3">
            <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-sm">
              <Hourglass className="w-12 h-12 text-yellow-600 mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Payment Request Pending
              </h3>
              <p className="text-yellow-700">
                You have already sent a payment request for ₹
                {paymentStatus?.requestedAmount}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                The provider is reviewing your request. You'll be notified once
                it's approved.
              </p>
            </div>
          </div>
        );
      }

      // Payment rejected
      if (paymentStatus?.requestStatus === "REJECTED") {
        return (
          <div className="space-y-3">
            <div className="text-center p-6 bg-red-50 border border-red-200 rounded-sm">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Payment Request Rejected
              </h3>
              <p className="text-red-700">
                {paymentStatus?.rejectionReason ||
                  "The provider rejected your payment request."}
              </p>
            </div>
            <Button
              onClick={() => setShowPaymentDialog(true)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <IndianRupee className="w-5 h-5 mr-2" />
              Request Payment Again
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Submit a new payment request with updated feedback
            </p>
          </div>
        );
      }

      // No payment request yet - show request button
      return (
        <div className="space-y-3">
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-sm">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Service Completed!
            </h3>
            <p className="text-green-700">
              Thank you for completing this service.
            </p>
          </div>
          <Button
            onClick={() => setShowPaymentDialog(true)}
            size="lg"
            className="w-full ">
            <IndianRupee className="w-5 h-5 mr-2" />
            Request Payment
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Click to request payment from the provider for this service
          </p>
        </div>
      );
    }

    const nextStep = STEPS[currentStepIndex + 1];
    if (!nextStep) return null;

    return (
      <Button
        onClick={() => handleTrackingUpdate(nextStep.key)}
        disabled={isUpdating}
        size="lg"
        className="w-full">
        {isUpdating ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Updating...
          </>
        ) : (
          <>
            {nextStep.label === "Completed" ? (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            ) : (
              <Circle className="w-5 h-5 mr-2" />
            )}
            {nextStep.label}
          </>
        )}
      </Button>
    );
  };

  // Loading state
  if (isLoading) {
    return <StaffBookingDetailSkeleton />;
  }

  // Not found state
  if (!booking) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-4xl px-4 py-8">
          <p className="text-gray-600">Booking not found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-4xl px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Bookings
            </button>
          </div>

          {/* Stepper */}
          {renderStepper()}

          {/* Booking Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {booking.service.name}
                </h3>
                <p className="text-gray-600">
                  {booking.businessProfile.businessName}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">
                    {formatDate(booking.date)}
                  </span>
                </div>
                {booking.slot && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-lg">
                      {booking.slot.time}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{booking.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{booking.user.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Service Location
                </h4>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <span>
                    {booking.address?.street}, {booking.address?.city},{" "}
                    {booking.address?.state}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>
                {booking.bookingStatus === "CANCELLED"
                  ? "Booking Cancelled"
                  : booking.trackingStatus === "COMPLETED"
                    ? "Booking Complete"
                    : "Update Status"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.bookingStatus !== "CANCELLED" &&
                booking.trackingStatus !== "COMPLETED" && (
                  <div className="text-sm text-gray-600">
                    <p>
                      Current Status:{" "}
                      <span className="font-semibold text-gray-900">
                        {STEPS[currentStepIndex].label}
                      </span>
                    </p>
                    <p className="mt-1">
                      Click the button below to move to the next step.
                    </p>
                  </div>
                )}
              {renderActionButtons()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Early Start Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Early Start Reason</DialogTitle>
            <DialogDescription>
              You're starting this service more than 30 minutes early. Please
              provide a reason for the customer and provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for starting early *</Label>
              <Input
                id="reason"
                placeholder="e.g., Customer requested earlier time, Staff availability, etc."
                value={earlyStartReason}
                onChange={(e) => setEarlyStartReason(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                This reason will be sent to both the customer and provider.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReasonDialog(false);
                  setEarlyStartReason("");
                  setPendingStatus(null);
                }}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReason}>
                Submit & Start Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Request Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-green-600" />
              Request Payment from Provider
            </DialogTitle>
            <DialogDescription>
              Submit your payment request for completing this service. The
              provider will review and approve your payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-sm p-4 space-y-2">
              <h4 className="font-semibold text-sm text-gray-900">
                Booking Details
              </h4>
              <div className="text-sm">
                <p className="text-gray-600">
                  Service:{" "}
                  <span className="font-medium text-gray-900">
                    {booking?.service?.name}
                  </span>
                </p>
                <p className="text-gray-600">
                  Date:{" "}
                  <span className="font-medium text-gray-900">
                    {formatDate(booking?.date)}
                  </span>
                </p>
                <p className="text-gray-600">
                  Service Price:{" "}
                  <span className="font-bold text-green-600">
                    ₹{booking?.service?.price}
                  </span>
                </p>
              </div>
            </div>

            {/* Feedback Input */}
            <div className="space-y-2">
              <Label htmlFor="feedback">
                Your Feedback <span className="text-gray-500">(optional)</span>
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share how the service went, any notes for the provider..."
                value={staffFeedback}
                onChange={(e) => setStaffFeedback(e.target.value)}
                maxLength={500}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                {staffFeedback.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPaymentDialog(false);
                  setStaffFeedback("");
                }}
                disabled={isRequestingPayment}>
                Cancel
              </Button>
              <Button
                onClick={handleRequestPayment}
                disabled={isRequestingPayment}
                className="bg-green-600 hover:bg-green-700">
                {isRequestingPayment ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stripe Connect Modal */}
      <StripeConnectModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onConnected={() => {
          // After connecting Stripe, staff can try payment request again
          setShowStripeModal(false);
          toast.success("Stripe account connected!", {
            description: "You can now request payments for your services",
          });
        }}
      />
    </>
  );
}
