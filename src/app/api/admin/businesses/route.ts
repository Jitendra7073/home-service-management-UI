import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";

    const backendRes = await backend(`/api/v1/admin/businesses?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch businesses",
      },
      { status: 500 }
    );
  }
}
