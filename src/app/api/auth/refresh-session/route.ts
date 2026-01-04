import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
    try {
        const { ok, status, data, headers } = await backend("/auth/refresh-token", {
            method: "POST",
            credentials: "include",
        });

        const response = NextResponse.json(data, {
            status: status ?? (ok ? 200 : 401),
        });

        // Forward Set-Cookie headers from backend to browser (append to keep both cookies)
        const setCookies = headers.get("set-cookie");
        if (setCookies) {
            response.headers.append("set-cookie", setCookies);
        }

        return response;
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, message: err.message || "Failed to refresh session" },
            { status: 401 }
        );
    }
}
