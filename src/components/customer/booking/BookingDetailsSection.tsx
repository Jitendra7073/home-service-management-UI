"use client";

import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  X,
  MapPin,
  IndianRupee,
  Smile,
  CheckCircle,
} from "lucide-react";
import CopyField from "@/components/customer/booking/CopyField";
import { PaymentStatusBadge } from "./StatusBadge";

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

  return (
    <div className="border-t border-gray-100 pt-4">
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
            {/* BOOKING ID */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 mb-1">Booking ID</p>
              <div className="cursor-pointer">
                <CopyField
                  id="bookingId"
                  value={booking.id}
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              </div>
            </div>

            {/* SERVICE ID */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 mb-1">Service ID</p>
              <div className="cursor-pointer">
                <CopyField
                  id="serviceId"
                  value={booking.serviceId}
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              </div>
            </div>

            {/* SLOT ID */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 mb-1">Slot ID</p>
              <div className="cursor-pointer">
                <CopyField
                  id="slotId"
                  value={booking.slotId}
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              </div>
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

      {/* Booking Details Footer */}
      <div className="flex justify-between items-center align-middle py-2">
        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2  border-t border-gray-100">
          {booking.bookingStatus === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelClick(booking)}
              disabled={booking.bookingStatus !== "PENDING"}
              className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
              <X className="w-4 h-4" />
              Cancel Booking
            </Button>
          )}

          {booking.bookingStatus !== "CANCELLED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCall(business?.phone)}
              className="flex items-center gap-2 border-gray-300">
              <Phone className="w-4 h-4" />
              Call Provider
            </Button>
          )}
          {booking.bookingStatus === "COMPLETED" && (
            <Button
              variant={booking?.isFeedbackProvided ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleFeedBackClick(booking?.id)}
              disabled={booking?.isFeedbackProvided}
              className={` flex items-center gap-2 px-4 transition-all duration-300 ease-in-out ${
                booking?.isFeedbackProvided
                  ? "bg-green-100 text-green-700 border-green-200 cursor-default"
                  : "border-green-300 text-green-700 hover:bg-green-50"
              }`}>
              {booking?.isFeedbackProvided ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Feedback Submitted</span>
                </>
              ) : (
                <>
                  <Smile className="w-4 h-4" />
                  <span className="font-medium">Give Feedback</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Payment Status Badge */}
        <PaymentStatusBadge status={booking.paymentStatus} />
      </div>

      <div className="px-4 py-1 rounded-sm bg-blue-50 border border-blue-200 text-[13px] text-blue-800 font-medium text-center">
        <p>
          We’ve already sent the invoice to your email following your payment.
        </p>
      </div>
    </div>
  );
}
