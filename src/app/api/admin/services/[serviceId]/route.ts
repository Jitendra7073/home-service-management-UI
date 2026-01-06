import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ serviceId: string }> }
) {
  const params = await props.params;
  try {
    const backendRes = await backend(
      `/api/v1/admin/services/${params.serviceId}`,
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
        message: err.message || "Failed to fetch service",
      },
      { status: 500 }
    );
  }
}
