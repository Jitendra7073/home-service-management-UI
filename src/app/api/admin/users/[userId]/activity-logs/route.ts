import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "20";
    const page = searchParams.get("page") || "1";
    const actionType = searchParams.get("actionType") || "";

    // Build query string
    const queryParams = new URLSearchParams({
      limit,
      page,
      ...(actionType && { actionType }),
    });

    const backendRes = await backend(
      `/api/v1/admin/users/${
        params.userId
      }/activity-logs?${queryParams.toString()}`,
      {
        method: "GET",
      },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch activity logs",
      },
      { status: 500 },
    );
  }
}
