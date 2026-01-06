import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/businesses - Fetch all businesses with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());


    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });


    const backendRes = await backend(
      `/api/v1/admin/businesses?${queryString.toString()}`,
      {
        method: "GET",
      },
      req
    );


    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    console.error("[API/admin/businesses] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch businesses",
      },
      { status: 500 }
    );
  }
}
