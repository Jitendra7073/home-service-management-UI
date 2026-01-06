import { NextRequest, NextResponse } from "next/server";
import { backend } from "@/lib/backend";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const {data} = await backend(`/api/v1/admin/users/${params.userId}`, {
      method: "GET",
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err.message || "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}