import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { ok, data, status } = await backend(
      "/api/v1/staff/stripe/onboarding"
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating Stripe onboarding link:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to generate Stripe onboarding link",
      },
      { status: 500 }
    );
  }
}
