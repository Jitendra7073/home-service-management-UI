import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/provider/slots", {
      method: "GET",
    });

    if (!ok) return NextResponse.json(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Something went wrong" });
  }
}
