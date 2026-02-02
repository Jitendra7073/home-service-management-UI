import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";
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
      // Handle special cases for isApproved filter
      ...(isApproved === "approved" && { isApproved: "true" }),
      ...(isApproved === "pending" && { employmentType: "GLOBAL_FREELANCE", isApproved: "false" }),
    });

    const { ok, data } = await backend(`/api/v1/staff/profiles?${queryParams}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch staff" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
