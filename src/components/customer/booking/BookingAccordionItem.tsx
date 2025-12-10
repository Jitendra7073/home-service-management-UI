import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { BookingStatusBadge } from "@/components/customer/booking/StatusBadge";
import BookingDetailsSection from "@/components/customer/booking/BookingDetailsSection";
import { Calendar, Clock, IndianRupee } from "lucide-react";

export default function BookingAccordionItem({
  booking,
  handleCopy,
  copiedField,
  formatDate,
  formatTime,
  formatDateTime,
  handleCancelClick,
  handleDownloadInvoice,
  handleCall,
}: any) {
  const serviceName = booking.service?.name || "Service";
  const slotTime = booking.slot?.time || "N/A";
  const businessEmail = booking.business?.email || "N/A";
  const businessPhone = booking.business?.phone || "N/A";
  const amount = booking.totalAmount || 0;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={booking.id}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-5 py-4 hover:bg-gray-50">
          <div className="flex items-center justify-between w-full pr-4">
            {/* LEFT SECTION */}
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>

              {/* Service + business details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                  {serviceName}
                </h3>

                <p className="text-sm text-gray-500 font-normal truncate">
                  Email: {businessEmail}
                </p>

                <p className="text-sm text-gray-500 font-normal truncate">
                  Phone: {businessPhone}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {slotTime}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col items-end gap-2">
              <BookingStatusBadge status={booking.bookingStatus} />

              <div className="flex items-center text-lg font-bold text-gray-900">
                <IndianRupee className="w-4 h-4" />
                {amount.toLocaleString()}
              </div>
            </div>
          </div>
        </AccordionTrigger>

        {/* DETAILS SECTION */}
        <AccordionContent className="px-5 pb-5 pt-0">
          <BookingDetailsSection
            booking={booking}
            handleCopy={handleCopy}
            copiedField={copiedField}
            formatDateTime={formatDateTime}
            handleCancelClick={handleCancelClick}
            handleDownloadInvoice={handleDownloadInvoice}
            handleCall={handleCall}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
