import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await backend("/api/v1/provider/subscription-plans", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(data?.plans);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" });
  }
}

export async function POST(req: Request) {
  try {
    const { priceId, isTrial } = await req.json();

    if (!priceId) {
      return NextResponse.json({ msg: "priceId is required" }, { status: 400 });
    }

    const { ok, data } = await backend(
      "/api/v1/payment/create-subscription-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, isTrial: isTrial || false }),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
