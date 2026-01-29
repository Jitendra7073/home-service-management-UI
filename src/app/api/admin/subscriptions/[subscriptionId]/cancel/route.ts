import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> },
) {
  try {
    const { subscriptionId } = await params;

    const body = await req.json();

    const { ok, data, status } = await backend(
      `/api/v1/admin/subscriptions/${subscriptionId}/cancel`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to cancel subscription" },
        { status },
      );
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
