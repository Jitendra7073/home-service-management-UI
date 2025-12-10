import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/customer/bookings", {
      method: "GET",
    });
    if (!ok) {
      return NextResponse.json(
        { error: data || "Failed to fetch bookings" },
        { status: 400 }
      );
    }
    return NextResponse.json({ bookings: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
