import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function PATCH(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const backendRes = await backend(`/api/v1/admin/businesses/${params.businessId}/restrict`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(backendRes.data, { status: backendRes.status ?? 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to restrict business" },
      { status: 500 }
    );
  }
}
