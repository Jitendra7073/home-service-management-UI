import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params;

    // Using common/content route
    const { ok, data } = await backend(`/api/v1/content/${key}`, {
      method: "GET",
    });

    // Content might return 404 if not found, passing that through
    if (!ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Content not found" },
        { status: ok ? 200 : 404 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("[API/common/content] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch content",
      },
      { status: 500 },
    );
  }
}
