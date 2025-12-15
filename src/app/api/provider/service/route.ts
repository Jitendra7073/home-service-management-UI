import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { ok, data } = await backend("/api/v1/provider/service", {
      method: "GET",
    });
    if (!ok) {
      return NextResponse.json(data?.msg, { status: 500 });
    }
    return NextResponse.json(data?.services);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { ok, data } = await backend("/api/v1/provider/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST service error:", error);

    return NextResponse.json(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { serviceId, isActive } = await req.json();

    const { ok, data } = await backend(
      `/api/v1/provider/service/${serviceId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PATCH service error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
