import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const {token} = await params;
  console.log("Reset password API token:", token);

  const body = await req.json();

  const { status, data } = await backend(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}
