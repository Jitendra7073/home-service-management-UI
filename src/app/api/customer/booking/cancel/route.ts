import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { bookingId, reason, reasonType } = await req.json();

    if (!bookingId || !reason || !reasonType) {
      return NextResponse.json(
        { error: "Invalid cancellation request" },
        { status: 400 }
      );
    }

    const { ok, data } = await backend(`/api/v1/customer/bookings/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, reason, reasonType }),
    });

    if (!ok) {
      return NextResponse.json(
        { error: data?.msg || "Cancellation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
