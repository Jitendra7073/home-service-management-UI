import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { availability } = body;

    if (!availability) {
      return NextResponse.json(
        { success: false, msg: "Availability status is required" },
        { status: 400 },
      );
    }

    const { ok, data } = await backend("/api/v1/staff/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability }),
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to update availability" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 },
    );
  }
}
