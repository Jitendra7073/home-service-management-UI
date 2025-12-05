import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, status, data, headers } = await backend("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = NextResponse.json(data, {
      status: status ?? (ok ? 200 : 400),
    });

    // Forward Set-Cookie headers from backend
    const setCookies = headers.get("set-cookie");
    if (setCookies) {
      response.headers.set("set-cookie", setCookies);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
