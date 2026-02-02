import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const paymentStatus = searchParams.get("paymentStatus") || "";

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(paymentStatus && { paymentStatus }),
    });

    const { ok, data } = await backend(`/api/v1/staff/earnings?${queryParams}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch earnings" },
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
