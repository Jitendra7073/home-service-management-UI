import { backend } from "@/lib/backend";
import { getAuthToken } from "@/lib/get-token";
import { NextResponse } from "next/server";

export async function GET() {
  const { ok, data, status } = await backend("/api/v1/profile", {
    method: "GET",
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status }
    );
  }
  return NextResponse.json({ user: data?.user }, { status });
}
