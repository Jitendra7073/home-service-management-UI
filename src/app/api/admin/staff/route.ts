import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/staff - Fetch all staff for admin management
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const queryParams = new URLSearchParams({ page, limit });
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);

    const backendRes = await backend(`/api/v1/admin/staff?${queryParams}`, {
      method: "GET",
    });

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch staff" },
      { status: 500 },
    );
  }
}
