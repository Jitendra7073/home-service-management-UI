import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ staffId: string }> },
) {
  const { staffId } = await params;
  try {
    const { ok, data } = await backend(`/api/v1/staff/profile/${staffId}`, {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch staff" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ staffId: string }> },
) {
  const { staffId } = await params;
  const body = await request.json();

  try {
    const { ok, data } = await backend(`/api/v1/staff/profile/${staffId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to update staff" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ staffId: string }> },
) {
  const { staffId } = await params;
  try {
    const { ok, data } = await backend(`/api/v1/staff/profile/${staffId}`, {
      method: "DELETE",
    });

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to delete staff" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
