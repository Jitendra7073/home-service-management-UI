import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST() {
  try {
    const backendRes = await backend("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const response = NextResponse.json(backendRes.data, {
      status: backendRes.status ?? (backendRes.ok ? 200 : 400),
    });

    // Clear cookies on frontend
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    // Forward Set-Cookie headers from backend if any
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
