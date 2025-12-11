import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/address", {
      method: "GET",
    });
    if (!ok) return NextResponse.json({ msg: "Response is not ok" });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Something went wrong" });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { ok, data } = await backend("/api/v1/address", {
      method: "POST",
      body,
    });

    if (!ok) {
      return NextResponse.json({ msg: "Response is not ok" }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
