import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const employmentType = searchParams.get("employmentType") || "";
    const isActive = searchParams.get("isActive") || "";
    const isApproved = searchParams.get("isApproved") || "";

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(employmentType && { employmentType }),
      ...(isActive && { isActive }),
      ...(isApproved && { isApproved }),
    });

    const { ok, data } = await backend(`/api/v1/staff/profiles?${queryParams}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json({ message: data?.msg || "Failed to fetch staff" }, { status: 500 });
    }

    return NextResponse.json(data);
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
    const { ok, data } = await backend("/api/v1/staff/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json({ message: data?.msg || "Failed to create staff" }, { status: data?.status || 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
