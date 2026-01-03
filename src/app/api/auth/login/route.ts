import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendRes = await backend("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = NextResponse.json(backendRes.data, {
      status: backendRes.status ?? (backendRes.ok ? 200 : 400),
    });

    // Forward Set-Cookie headers from backend
    if (backendRes.headers) {
      const setCookieHeader = backendRes.headers.get("set-cookie");
      if (setCookieHeader) {
        response.headers.set("set-cookie", setCookieHeader);
      }
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
