import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const backendRes = await backend(
      `/api/v1/provider/business-category?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendRes = await backend("/api/v1/provider/business-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(backendRes.data, {
      status: backendRes.status ?? 201,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to create category",
      },
      { status: err.response?.status || 500 }
    );
  }
}
