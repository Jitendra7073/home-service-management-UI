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
} from "lucide-react";
import CopyField from "@/components/customer/booking/CopyField";
import { PaymentStatusBadge } from "./StatusBadge";
import PaymentTimer from "./PaymentTimer";

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
      {/* ------------------------- PENDING PAYMENT ------------------------- */}
      {isPendingPayment ? (
        <div className="w-full">
          <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                    window.open(booking.paymentLink, "_blank");
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
          {/* ------------------------- MAIN DETAILS GRID ------------------------- */}
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
                  <p className="text-sm text-gray-700">{slot?.time || "N/A"}</p>
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

          {/* ------------------------- FOOTER ------------------------- */}
          <div className="flex justify-between items-center py-2">
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
                        onClick={() => handleCancelClick(booking)}
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
                          booking.isFeedbackProvided ? "secondary" : "outline"
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
            We’ve already sent the invoice to your email following your payment.
          </div>
        </>
      )}
    </div>
  );
}
