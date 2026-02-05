import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import authMiddleware from "./lib/middlewares/auth-middleware";

export default async function middleware(req: NextRequest) {
  try {
    return await authMiddleware(req);
  } catch (error) {
    console.error("Proxy fatal error:", error);

    const loginUrl = new URL("/auth/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
