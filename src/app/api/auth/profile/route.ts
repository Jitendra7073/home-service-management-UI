import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(req: Request) {
  const token = (req as any).cookies?.get?.("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { status, data } = await backend("/api/v1/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(data, { status });
}
