import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ serviceId: string }> };

// ================= GET =================
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const { ok, data } = await backend(
      `/api/v1/provider/team-member/${serviceId}`,
      { method: "GET" }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to fetch members" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= POST =================
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;
    const body = await req.json();

    const { ok, data } = await backend(
      `/api/v1/provider/team-member/${serviceId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to create team member" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= PATCH =================
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { success: false, msg: "memberId query parameter is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const payload = {
      name:body.name,
      description:body.description,
      email:body.email,
      phone:body.phone,
      role:body.role,
      status:body.status
    }

    const { ok, data } = await backend(
      `/api/v1/provider/team-member/${serviceId}/${memberId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to update team member" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { serviceId } = await params;

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { success: false, msg: "memberId query parameter is required" },
        { status: 400 }
      );
    }
    const { ok, data } = await backend(
      `/api/v1/provider/team-member/${serviceId}/${memberId}`,
      {
        method: "DELETE",
      }
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to DELETE team member" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}
