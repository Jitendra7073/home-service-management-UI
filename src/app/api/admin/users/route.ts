import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });

    const backendRes = await backend(
      `/api/v1/admin/users?${queryString.toString()}`,
      {
        method: "GET",
      }
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    console.error("[API/admin/users] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
