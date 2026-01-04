import { NextResponse } from "next/server";

/**
 * Helper to create Next.js responses that automatically forward Set-Cookie headers
 * from the backend (for token refresh during middleware auth)
 */
export function createBackendResponse(
    data: any,
    status: number,
    backendHeaders?: Headers
) {
    const response = NextResponse.json(data, { status });

    // Forward Set-Cookie headers from backend to browser
    // This ensures token refresh cookies are properly sent to client
    if (backendHeaders) {
        const setCookies = backendHeaders.get("set-cookie");
        if (setCookies) {
            response.headers.set("set-cookie", setCookies);
        }
    }

    return response;
}
