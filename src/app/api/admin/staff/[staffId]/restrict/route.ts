import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * PATCH /api/admin/staff/[staffId]/restrict - Restrict a staff member
 */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const body = await req.json();

    const backendRes = await backend(
      `/api/v1/admin/staff/${params.staffId}/restrict`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      },
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to restrict staff" },
      { status: 500 },
    );
  }
}
