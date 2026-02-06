import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    const params = new URLSearchParams();
    if (status && status !== "all") {
      params.append("status", status);
    }
    params.append("page", page);
    params.append("limit", limit);

    const { ok, data, status: statusCode } = await backend(
      `/api/v1/staff/payments/history?${params.toString()}`
    );

    if (!ok) {
      return NextResponse.json(data, { status: statusCode });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to fetch payment history",
      },
      { status: 500 }
    );
  }
}
