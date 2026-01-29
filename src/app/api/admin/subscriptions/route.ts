import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    // Pass query params (page, limit, search, status) to backend
    const { ok, data, status } = await backend(
      `/api/v1/admin/subscriptions?${query}`,
      {
        method: "GET",
      },
    );

    if (!ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch subscriptions" },
        { status },
      );
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
