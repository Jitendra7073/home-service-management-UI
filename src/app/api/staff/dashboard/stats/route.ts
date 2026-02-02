import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { ok, data } = await backend("/api/v1/staff/dashboard/stats", {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch dashboard stats" },
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
