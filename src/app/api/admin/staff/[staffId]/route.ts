import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/staff/[staffId] - Fetch staff details by ID
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const backendRes = await backend(`/api/v1/admin/staff/${params.staffId}`, {
      method: "GET",
    });

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch staff details",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/staff/[staffId] - Update staff (restrict/lift-restriction)
 */
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ staffId: string }> },
) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { action, reason } = body;

    let endpoint = `/api/v1/admin/staff/${params.staffId}`;

    if (action === "restrict") {
      endpoint += "/restrict";
    } else if (action === "lift-restriction") {
      endpoint += "/lift-restriction";
    } else {
      return NextResponse.json(
        { ok: false, message: "Invalid action" },
        { status: 400 },
      );
    }

    const backendRes = await backend(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to update staff",
      },
      { status: 500 },
    );
  }
}
