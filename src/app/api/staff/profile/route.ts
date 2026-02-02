import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get staff profile from backend
    const { ok, data } = await backend("/api/v1/staff/profile", {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch staff profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
