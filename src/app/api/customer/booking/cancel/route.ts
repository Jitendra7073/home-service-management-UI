import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const { ok, data } = await backend(`/api/v1/payment/booking/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    if (!ok) {
      return NextResponse.json(
        { error: data?.msg || "Cancellation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Booking cancelled successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
