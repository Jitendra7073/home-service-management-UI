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

export async function POST(req: Request) {
  try {
    const { serviceId, slotId } = await req.json();

    const { ok, data } = await backend("/api/v1/customer/book-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, slotId }),
    });

    if (!ok) {
      return NextResponse.json(
        { error: data || "Booking failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Booking created successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


