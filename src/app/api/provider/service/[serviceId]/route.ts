import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ serviceId: string }>;
}

// ================= GET =================
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const { ok, data } = await backend(
      `/api/v1/provider/service?serviceId=${serviceId}`,
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
    console.error("Service fetch error:", error);
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ================= PATCH =================
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;
    const body = await req.json();

    const { ok, data } = await backend(
      `/api/v1/provider/service/${serviceId}`,
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
    console.error("Service update error:", error);
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const { ok, data } = await backend(
      `/api/v1/provider/service/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to delete service" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, msg: "Service deleted" });
  } catch (error) {
    console.error("Service delete error:", error);
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}