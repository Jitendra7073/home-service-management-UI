import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { ok, data, status } = await backend(
      "/api/v1/provider/stripe/bank-account"
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bank account details:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to fetch bank account details",
      },
      { status: 500 }
    );
  }
}
