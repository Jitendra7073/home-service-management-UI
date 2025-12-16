import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const {token} = await params;

  const body = await req.json();

  const { status, data } = await backend(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}
