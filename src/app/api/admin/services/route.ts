import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/services - Fetch all services with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });

    const { ok, data } = await backend(
      `/api/v1/admin/services?${queryString.toString()}`,
      {
        method: "GET",
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch services" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: data.data || data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API/admin/services] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}
