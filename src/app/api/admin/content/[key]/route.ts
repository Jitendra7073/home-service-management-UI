import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }, // Updated to Promise for Next.js 15+ compat or standard
) {
  try {
    const { key } = await params;
    const body = await req.json();

    const { ok, data } = await backend(`/api/v1/admin/content/${key}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to update content",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("[API/admin/content] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to update content",
      },
      { status: 500 },
    );
  }
}
