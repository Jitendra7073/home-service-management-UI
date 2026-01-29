import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// Create Plan
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { ok, data, status } = await backend("/api/v1/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

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

// Get All Plans
export async function GET(req: NextRequest) {
  try {
    const { ok, data, status } = await backend("/api/v1/admin/plans", {
      method: "GET",
    });

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
