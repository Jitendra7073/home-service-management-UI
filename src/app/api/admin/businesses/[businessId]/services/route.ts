import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

/**
 * GET /api/admin/businesses/[businessId]/services - Fetch services for a business
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const queryString = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });

    const backendRes = await backend(
      `/api/v1/admin/services?businessId=${params.businessId}&${queryString.toString()}`,
      {
        method: "GET",
      }
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}
