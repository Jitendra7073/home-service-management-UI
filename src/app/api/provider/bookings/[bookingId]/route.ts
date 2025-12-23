import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

// Define the params interface for async access in Next.js 15
interface RouteParams {
  params: Promise<{ bookingId: string }>;
}

// ================= GET =================
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { bookingId } = await params;

    const { ok, data } = await backend(
      `/api/v1/provider/booking?bookingId=${bookingId}`,
      {
        method: "GET",
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to fetch service" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ================= PATCH (Update) =================
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { bookingId } = await params;
    const body = await req.json();

    const { ok, data } = await backend(
      `/api/v1/provider/booking/${bookingId}`, 
      {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to update service" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}
