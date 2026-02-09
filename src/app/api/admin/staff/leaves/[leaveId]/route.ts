import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * PATCH /api/admin/staff/leaves/[leaveId] - Update leave status
 */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ leaveId: string }> }
) {
  const params = await props.params;
  try {
    const body = await req.json();

    const backendRes = await backend(
      `/api/v1/admin/staff/leaves/${params.leaveId}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to update leave status" },
      { status: 500 }
    );
  }
}
