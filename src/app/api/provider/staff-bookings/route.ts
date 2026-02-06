import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingStatus = searchParams.get("bookingStatus");
    const trackingStatus = searchParams.get("trackingStatus");

    // First get provider's business profile
    const { ok: businessOk, data: businessData } = await backend("/api/v1/business/my-business", {
      method: "GET",
    });

    if (!businessOk || !businessData?.success) {
      return NextResponse.json(
        { success: false, msg: "Failed to fetch business profile" },
        { status: 500 },
      );
    }

    const businessProfileId = businessData.business?.id;

    if (!businessProfileId) {
      return NextResponse.json(
        { success: false, msg: "Business profile not found" },
        { status: 404 },
      );
    }

    // Get all bookings for this business with staff assignments
    const query = new URLSearchParams();
    if (bookingStatus && bookingStatus !== "all") {
      query.append("bookingStatus", bookingStatus);
    }
    if (trackingStatus && trackingStatus !== "all") {
      query.append("trackingStatus", trackingStatus);
    }

    // Fetch all bookings and filter for staff-assigned ones
    const { ok, data } = await backend(`/api/v1/provider/bookings?${query}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: "Failed to fetch bookings" },
        { status: 500 },
      );
    }

    // Filter bookings that have staff assignments
    const staffBookings = (data?.bookings || []).filter(
      (booking: any) => booking.StaffAssignBooking && booking.StaffAssignBooking.length > 0
    );

    return NextResponse.json({
      success: true,
      bookings: staffBookings,
      count: staffBookings.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 },
    );
  }
}
