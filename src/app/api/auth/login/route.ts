// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, status, data } = await backend("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(
      data,
      { status: status ?? (ok ? 200 : 400) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
