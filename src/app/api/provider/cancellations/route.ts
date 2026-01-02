import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend(
      "/api/v1/provider/cancellations",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!ok) {
      return NextResponse.json(
        { error: data?.msg || "Failed to fetch cancellations" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        cancellations: data?.cancellations || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}