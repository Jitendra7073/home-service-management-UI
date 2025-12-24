import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params;

    const { ok, data, status } = await backend(
      `/api/v1/customer/providers/${providerId}`,
      { method: "GET" }
    );

    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to fetch provider",
        },
        { status: status || 500 }
      );
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
