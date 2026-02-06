import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET() {
  try {
    const { ok, data, status } = await backend(`/api/v1/staff/leave`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(data, { status: status });
  } catch (error) {
    console.error("Error fetching staff leaves:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to fetch leave requests" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { ok, data, status } = await backend(`/api/v1/staff/leave/request`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: status });
  } catch (error) {
    console.error("Error creating staff leave:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to create leave request" },
      { status: 500 },
    );
  }
}
