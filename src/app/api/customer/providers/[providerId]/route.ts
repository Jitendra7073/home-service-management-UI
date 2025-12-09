import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    providerId: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { providerId } = await params;

    const { ok, data, status } = await backend(
      `/api/v1/customer/providers/${providerId}`,
      { method: "GET" }
    );

    // If backend returns a failure response
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
