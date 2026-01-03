import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await backend("/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = NextResponse.json(backendRes.data, {
    status: backendRes.status ?? (backendRes.ok ? 200 : 400),
  });

  // Forward all Set-Cookie headers from backend
  if (backendRes.headers) {
    const setCookieHeader = backendRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }
  }

  return response;
}
