import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/staff/[staffId]/businesses - Fetch staff businesses
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);

    const backendRes = await backend(
      `/api/v1/admin/staff/${params.staffId}/businesses?${queryParams}`,
      { method: "GET" },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to fetch staff businesses" },
      { status: 500 },
    );
  }
}
