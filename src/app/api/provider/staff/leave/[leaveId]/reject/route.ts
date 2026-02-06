import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ leaveId: string }> },
) {
  const { leaveId } = await params;
  const body = await request.json();

  try {
    const { ok, data } = await backend(`/api/v1/provider/staff/leave/${leaveId}/reject`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to reject leave" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
