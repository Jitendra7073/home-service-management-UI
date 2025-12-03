import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  const body = await req.json();

  const { status, data } = await backend("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}