import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const { ok, status, data, headers } = await backend("/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = NextResponse.json(data, {
    status: status ?? (ok ? 200 : 400),
  });

  // Forward Set-Cookie headers from backend
  const setCookies = headers.get("set-cookie");
  if (setCookies) {
    response.headers.set("set-cookie", setCookies);
  }

  return NextResponse.json(data, { status });
}
