
import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(req: NextRequest) {
  try {
    const { ok, data } = await backend("/api/v1/admin/dashboard/analytics", {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch dashboard analytics" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("[API/admin/dashboard/analytics] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch dashboard analytics",
      },
      { status: 500 }
    );
  }
}
