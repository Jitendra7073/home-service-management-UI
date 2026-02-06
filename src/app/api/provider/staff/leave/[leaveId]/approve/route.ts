import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ leaveId: string }> },
) {
  const { leaveId } = await params;
  try {
    const { ok, data } = await backend(`/api/v1/provider/staff/leave/${leaveId}/approve`, {
      method: "PUT",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to approve leave" },
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
