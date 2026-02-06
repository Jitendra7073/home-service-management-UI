import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { ok, data, status } = await backend(
      "/api/v1/provider/payments/stripe/status"
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking Stripe account status:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to check Stripe account status",
      },
      { status: 500 }
    );
  }
}
