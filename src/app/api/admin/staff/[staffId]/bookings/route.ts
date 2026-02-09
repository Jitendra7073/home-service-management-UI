import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/staff/[staffId]/bookings - Fetch staff bookings
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const queryParams = new URLSearchParams({ page, limit });
    if (status) queryParams.append("status", status);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const backendRes = await backend(
      `/api/v1/admin/staff/${params.staffId}/bookings?${queryParams}`,
      { method: "GET" },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to fetch staff bookings" },
      { status: 500 },
    );
  }
}
