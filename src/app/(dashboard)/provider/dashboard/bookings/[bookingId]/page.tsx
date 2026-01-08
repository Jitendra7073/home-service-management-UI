import React from "react";
import BookingDashboard from "./booking-by-id";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Details",
  description: "View and manage your booking details effectively with Fixora.",
};

const BookingById = async ({ params }: { params: { bookingId: string } }) => {
  const { bookingId } = await params;
  return <BookingDashboard bookingId={bookingId} />;
};

export default BookingById;
