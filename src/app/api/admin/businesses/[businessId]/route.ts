import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/businesses/[businessId] - Fetch business by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const backendRes = await backend(
      `/api/v1/admin/businesses/${params.businessId}`,
      {
        method: "GET",
      }
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch business",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/businesses/[businessId] - Update business (approve/restrict)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const body = await req.json();
    const { action, reason } = body;

    let endpoint = `/api/v1/admin/businesses/${params.businessId}`;
    if (action === "approve") {
      endpoint += "/approve";
    } else if (action === "restrict") {
      endpoint += "/restrict";
    } else if (action === "lift-restriction") {
      endpoint += "/lift-restriction";
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
        message: err.message || "Failed to update business",
      },
      { status: 500 }
    );
  }
}
