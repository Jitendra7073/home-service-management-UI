import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ serviceId: string }> }
) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { reason } = body;

    let endpoint = `/api/v1/admin/services/${params.serviceId}/lift-restriction`;

    const { data } = await backend(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to update service",
      },
      { status: 500 }
    );
  }
}
