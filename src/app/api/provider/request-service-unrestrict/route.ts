import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ok, data } = await backend(
      "/api/v1/provider/request-service-unrestrict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Failed to submit request" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { msg: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
