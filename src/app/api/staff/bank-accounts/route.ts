import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { ok, data, status } = await backend("/api/v1/staff/bank-accounts");

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to fetch bank accounts",
      },
      { status: 500 }
    );
  }
}
