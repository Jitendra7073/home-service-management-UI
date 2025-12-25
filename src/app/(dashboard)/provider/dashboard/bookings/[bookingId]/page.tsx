import React from "react";
import BookingDashboard from "./booking-by-id";

const BookingById = async ({ params }: { params: { bookingId: string } }) => {
  const { bookingId } = await params;
  return <BookingDashboard bookingId={bookingId}/>;
};

export default BookingById;
