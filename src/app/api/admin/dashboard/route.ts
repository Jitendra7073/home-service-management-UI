import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";


export async function GET(req: NextRequest) {
  try {

    const {data}= await backend("/api/v1/admin/dashboard/stats", {
      method: "GET",
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API/admin/dashboard] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
