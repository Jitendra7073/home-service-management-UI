"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  X,
  MapPin,
  IndianRupee,
  Smile,
  CheckCircle,
  CreditCard,
  Cross,
  AlertTriangle,
  Info,
} from "lucide-react";
import CopyField from "@/components/customer/booking/CopyField";
import { PaymentStatusBadge } from "./StatusBadge";
import PaymentTimer from "./PaymentTimer";
import RefundStatusBadge from "./RefundStatusBadge";
import { useQuery } from "@tanstack/react-query";

const CancellationSkeleton = () => {
  return (
    <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50  p-4 rounded-md shadow-sm animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-4">
          <div className="flex justify-start items-center gap-3">
            {/* Icon skeleton */}
            <div className="w-6 h-6 rounded-full bg-red-200 mt-1" />
            {/* Title */}
            <div className="h-4 w-40 bg-red-200 rounded" />
          </div>

          {/* Description */}
          <div className="h-3 w-full bg-red-100 rounded" />
          <div className="h-3 w-2/3 bg-red-100 rounded" />

          {/* Amount card */}
          <div className="bg-white rounded-md p-3 border border-red-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            {/* Refund status row */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Reason */}
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default function BookingDetailsSection({
  booking,
  handleCopy,
  copiedField,
  formatDateTime,
  handleCancelClick,
  handleFeedBackClick,
  handleCall,
}: any) {
  const address = booking.address;
  const business = booking.business;
  const service = booking.service;
  const slot = booking.slot;

  /* ------------------------- FETCH CANCELLATION DETAILS ------------------------- */
  const {
    data: cancellationData,
    isLoading: isCancellationLoading,
    error: cancellationError,
  } = useQuery({
    queryKey: ["cancellation", booking.id],
    queryFn: async () => {
      if (
        booking.bookingStatus !== "CANCELLED" &&
        booking.bookingStatus !== "CANCEL_REQUESTED"
      ) {
        return null;
      }

      const res = await fetch(
        `/api/customer/booking/${booking.id}/cancellation`
      );

      if (!res.ok) {
        const errorText = await res.text();
        return null;
      }

      const data = await res.json();
      return data;
    },
    enabled:
      booking.bookingStatus === "CANCELLED" ||
      booking.bookingStatus === "CANCEL_REQUESTED",
  });

  const cancellation = cancellationData?.cancellation;

  const isPendingPayment =
    booking.paymentStatus === "PENDING" &&
    booking.bookingStatus === "PENDING_PAYMENT" &&
    booking.paymentLinkInfo;

  // LOCAL TIMER STATE
  const [timeLeft, setTimeLeft] = useState({
    minutes: booking.paymentLinkInfo?.timeLeftMinutes ?? 0,
    seconds: booking.paymentLinkInfo?.timeLeftSeconds ?? 0,
  });

  // COUNTDOWN LOGIC
  useEffect(() => {
    if (!isPendingPayment) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        clearInterval(interval);
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPendingPayment]);

  const isExpired = timeLeft.minutes * 60 + timeLeft.seconds <= 0;

  /* ------------------------- BOOKING ACTIONS ------------------------- */
  const getBookingActions = (booking: any) => {
    switch (booking.bookingStatus) {
      case "PENDING":
      case "PENDING_PAYMENT":
      case "CONFIRMED":
        return { canCancel: true, canCall: true, canGiveFeedback: false };

      case "CANCEL_REQUESTED":
        return { canCancel: false, canCall: true, canGiveFeedback: false };

      case "CANCELLED":
        return { canCancel: false, canCall: true, canGiveFeedback: false };

      case "COMPLETED":
        return { canCancel: false, canCall: false, canGiveFeedback: true };

      default:
        return { canCancel: false, canCall: false, canGiveFeedback: false };
    }
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      {/* ------------------------- CANCELLATION ALERT (TOP) ------------------------- */}
      {booking.bookingStatus === "CANCELLED" && !cancellation && (
        <CancellationSkeleton />
      )}

      {booking.bookingStatus === "CANCELLED" && cancellation && (
        <div className=" bg-linear-to-r from-red-50 to-orange-50  p-4 rounded-md ">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex justify-start gap-2 items-center mb-2 ">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <h3 className="text-base font-bold text-red-900">
                  Booking Cancelled
                </h3>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Your booking has been successfully cancelled.
                {cancellation?.refundAmount > 0 &&
                  " Refund is being processed."}
              </p>

              {cancellation && cancellation.refundAmount > 0 && (
                <div className="bg-white rounded-md p-3 border border-red-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Original Amount
                      </p>
                      <p className="font-semibold text-gray-900">
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                    {cancellation.refundAmount < booking.totalAmount && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Cancellation Fee
                        </p>
                        <p className="font-semibold text-red-600">
                          - ₹{booking.totalAmount - cancellation.refundAmount}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Refund Amount
                      </p>
                      <p className="font-semibold text-green-600">
                        ₹{cancellation.refundAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-700">
                      Refund Status:
                    </span>
                    <RefundStatusBadge
                      refundStatus={cancellation.refundStatus}
                      refundAmount={cancellation.refundAmount}
                      cancellationFee={
                        booking.totalAmount - cancellation.refundAmount
                      }
                      originalAmount={booking.totalAmount}
                      refundedAt={cancellation.refundedAt}
                    />
                  </div>

                  {cancellation.refundStatus === "PENDING" && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Refund initiated. Will be credited to your original
                        payment method within 5-7 business days.
                      </span>
                    </div>
                  )}

                  {cancellation.refundStatus === "PROCESSING" && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Your refund is being processed by our payment gateway.
                        You'll receive it within 5-7 business days.
                      </span>
                    </div>
                  )}

                  {cancellation.refundStatus === "PAID" && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Refund completed on{" "}
                        {new Date(cancellation.refundedAt!).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        . Check your account statement.
                      </span>
                    </div>
                  )}

                  {cancellation.refundStatus === "FAILED" && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Refund failed. Please contact support at
                        support@homeservice.com
                      </span>
                    </div>
                  )}
                </div>
              )}

              {cancellation && cancellation.reason && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Cancellation Reason: </span>
                  <span className="font-medium text-gray-900">
                    {cancellation.reason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------- PENDING PAYMENT ------------------------- */}
      {isPendingPayment ? (
        <div className="w-full">
          <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h5 className="font-semibold text-yellow-800 mb-1">
                  Payment Required
                </h5>
                <p className="text-sm text-yellow-700">
                  Complete your payment to confirm this booking
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <PaymentTimer timeLeft={timeLeft} />

                <Button
                  onClick={() => {
                    if (isExpired) return;
                    window.open(booking.paymentLinkInfo.url, "_blank");
                  }}
                  disabled={isExpired}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  size="sm">
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ------------------------- MAIN DETAILS GRID (Only show if NOT cancelled) ------------------------- */}
          {booking.bookingStatus !== "CANCELLED" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* SERVICE DETAILS */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                  Service Details
                </h4>

                <div className="space-y-3 pl-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service Name</p>
                    <p className="text-sm text-gray-700">{service?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service Time</p>
                    <p className="text-sm text-gray-700">
                      {slot?.time || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {booking.totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOOKING INFO */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                  Booking Information
                </h4>

                <div className="space-y-3 pl-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Booking ID</p>
                    <CopyField
                      id="bookingId"
                      value={booking.id}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Service ID</p>
                    <CopyField
                      id="serviceId"
                      value={booking.serviceId}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Slot ID</p>
                    <CopyField
                      id="slotId"
                      value={booking.slotId}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="text-sm text-gray-700">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* BUSINESS DETAILS */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                  Business Details
                </h4>

                <div className="space-y-3 pl-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Business Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {business?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="text-sm text-gray-700">{business?.phone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="text-sm text-gray-700 break-all">
                      {business?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS DETAILS */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                  Service Address
                </h4>

                <div className="space-y-3 pl-3">
                  <p className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {address?.street}, {address?.city}, {address?.state} -{" "}
                    {address?.postalCode}
                  </p>

                  <p className="text-sm text-gray-700">{address?.country}</p>

                  {address?.landmark && (
                    <p className="text-xs text-gray-500">
                      Landmark: {address.landmark}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------- FOOTER (Only show if NOT cancelled) ------------------------- */}
          {booking.bookingStatus !== "CANCELLED" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 border-t border-gray-100">
                  {(() => {
                    const actions = getBookingActions(booking);

                    return (
                      <>
                        {/* Cancel Booking */}
                        {actions.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                              // Prevent accordion toggle and ensure our designed dialog opens
                              e.stopPropagation();
                              handleCancelClick(booking);
                            }}
                            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
                            <X className="w-4 h-4" />
                            Cancel Booking
                          </Button>
                        )}

                        {/* Call Provider */}
                        {actions.canCall && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(business?.phone)}
                            className="flex items-center gap-2 border-gray-300">
                            <Phone className="w-4 h-4" />
                            Call Provider
                          </Button>
                        )}

                        {/* Feedback */}
                        {actions.canGiveFeedback && (
                          <Button
                            variant={
                              booking.isFeedbackProvided
                                ? "secondary"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleFeedBackClick(booking.id)}
                            disabled={booking.isFeedbackProvided}
                            className="flex items-center gap-2">
                            {booking.isFeedbackProvided ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Feedback Submitted
                              </>
                            ) : (
                              <>
                                <Smile className="w-4 h-4" />
                                Give Feedback
                              </>
                            )}
                          </Button>
                        )}
                      </>
                    );
                  })()}
                </div>

                <PaymentStatusBadge status={booking.paymentStatus} />
              </div>

              <div className="px-4 py-1 rounded-sm bg-blue-50 border border-blue-200 text-[13px] text-blue-800 font-medium text-center">
                We've already sent the invoice to your email following your
                payment.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
