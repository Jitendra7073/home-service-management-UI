import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
      ...(date && { date }),
    });

    const { ok, data } = await backend(`/api/v1/staff/bookings?${queryParams}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
