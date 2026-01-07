import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function PATCH(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const backendRes = await backend(`/api/v1/admin/users/${params.userId}/lift-restriction`, {
      method: "PATCH",
    });

    return NextResponse.json(backendRes.data, { status: backendRes.status ?? 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to unblock user" },
      { status: 500 }
    );
  }
}
