import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { ok, data, status } = await backend("/api/v1/provider/bank-account");

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to fetch bank account",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ok, data, status } = await backend(
      "/api/v1/provider/bank-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding bank account:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to add bank account",
      },
      { status: 500 },
    );
  }
}
