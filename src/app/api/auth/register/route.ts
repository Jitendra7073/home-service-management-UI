import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  const body = await req.json();

  const { ok, status, data } = await backend("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}
