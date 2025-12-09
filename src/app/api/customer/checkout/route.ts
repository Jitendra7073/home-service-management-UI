import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cartItems || !Array.isArray(body.cartItems)) {
      return NextResponse.json(
        { msg: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!body.addressId) {
      return NextResponse.json(
        { msg: "Address ID is required" },
        { status: 400 }
      );
    }

    const { ok, data, status } = await backend(
      "/api/v1/payment/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Failed to create checkout session" },
        { status }
      );
    }

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("Next.js route error:", err);

    return NextResponse.json(
      { msg: "Failed to contact backend server" },
      { status: 500 }
    );
  }
}
