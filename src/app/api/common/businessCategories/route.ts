import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const {
      ok,
      status,
      data: { categories },
    } = await backend("/api/v1/business-category", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (ok) {
      return NextResponse.json({
        status: status,
        categories: categories,
      });
    }
    return NextResponse.json({ status: status, categories: [] });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
