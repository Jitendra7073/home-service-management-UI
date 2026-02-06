import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const { bookingId } = await params;

    const { ok, data, status } = await backend(
      `/api/v1/staff/payments/booking/${bookingId}/status`,
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching booking payment status:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to fetch payment status",
      },
      { status: 500 },
    );
  }
}
