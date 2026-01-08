import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, data } = await backend("/api/v1/provider/request-unrestrict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}
