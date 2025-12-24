"use client";
import BookingHeader from "@/components/provider/header";
import { BookingTable } from "@/components/provider/dashboard/booking-table";

export default function BookingView() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6  space-y-8 md:space-y-14">
        <BookingHeader
          title="Bookings"
          description="Track and manage customer bookings"
        />
        <BookingTable NumberOfRows={10} />
      </div>
    </div>
  );
}
