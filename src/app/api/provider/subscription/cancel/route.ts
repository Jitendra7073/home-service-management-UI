import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { ok, data } = await backend("/api/v1/payment/cancel-subscription", {
      method: "POST",
    });

    if (!ok) {
      return NextResponse.json(data, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
