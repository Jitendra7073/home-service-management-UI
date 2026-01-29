import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// Update Plan
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> },
) {
  try {
    const { planId } = await params;
    const body = await req.json();

    const { ok, data, status } = await backend(
      `/api/v1/admin/plans/${planId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!ok) {
      return NextResponse.json(
        { message: data?.message || "Failed" },
        { status },
      );
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Delete Plan
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> },
) {
  try {
    const { planId } = await params;
    const body = await req.json();

    const { ok, data, status } = await backend(
      `/api/v1/admin/plans/${planId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!ok) {
      return NextResponse.json(
        { message: data?.message || "Failed", data: data?.data },
        { status },
      );
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
