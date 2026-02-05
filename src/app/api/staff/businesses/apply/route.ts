import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

// -------------------- POST --------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, data } = await backend("/api/v1/staff/applications/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessProfileId: body.businessProfileId }),
    });

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}
