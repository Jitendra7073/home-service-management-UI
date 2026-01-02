import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { cancellationId } = await req.json();

    if (!cancellationId) {
      return NextResponse.json(
        { error: "Cancellation ID is required" },
        { status: 400 }
      );
    }

    const { ok, data } = await backend(
      "/api/v1/provider/cancellations/refund",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationId }),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { error: data?.msg || "Refund failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Cancellation approved and refund initiated",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
