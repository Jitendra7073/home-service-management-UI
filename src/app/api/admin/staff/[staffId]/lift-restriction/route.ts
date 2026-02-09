import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * PATCH /api/admin/staff/[staffId]/lift-restriction - Lift restriction for a staff member
 */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const backendRes = await backend(
      `/api/v1/admin/staff/${params.staffId}/lift-restriction`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to lift staff restriction" },
      { status: 500 },
    );
  }
}
