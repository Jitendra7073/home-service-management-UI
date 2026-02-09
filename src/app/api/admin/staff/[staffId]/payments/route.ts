import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/staff/[staffId]/payments - Fetch staff payments
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

    const queryParams = new URLSearchParams({ page, limit });
    if (status) queryParams.append("status", status);

    const backendRes = await backend(
      `/api/v1/admin/staff/${params.staffId}/payments?${queryParams}`,
      { method: "GET" },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to fetch staff payments" },
      { status: 500 },
    );
  }
}
