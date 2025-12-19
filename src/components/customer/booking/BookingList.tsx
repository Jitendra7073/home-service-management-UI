import BookingSkeleton from "@/components/customer/booking/BookingSkeleton";
import BookingAccordionItem from "@/components/customer/booking/BookingAccordionItem";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function BookingList({
  isLoading,
  filteredBookings,
  searchQuery,
  handleCopy,
  copiedField,
  formatDate,
  formatTime,
  formatDateTime,
  handleCancelClick,
  handleFeedBackClick,
  handleDownloadInvoice,
  handleCall,
}: any) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <BookingSkeleton />
        <BookingSkeleton />
        <BookingSkeleton />
      </div>
    );
  }

  if (filteredBookings.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="py-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Start booking services to see them here"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {filteredBookings.map((booking: any) => (
        <BookingAccordionItem
          key={booking.id}
          booking={booking}
          handleCopy={handleCopy}
          copiedField={copiedField}
          formatDate={formatDate}
          formatTime={formatTime}
          formatDateTime={formatDateTime}
          handleCancelClick={handleCancelClick}
          handleFeedBackClick={handleFeedBackClick}
          handleDownloadInvoice={handleDownloadInvoice}
          handleCall={handleCall}
        />
      ))}
    </div>
  );
}
