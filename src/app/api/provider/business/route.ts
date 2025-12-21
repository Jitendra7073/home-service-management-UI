import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

// -------------------- GET --------------------
export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/provider/business", {
      method: "GET",
    });

    if (!ok) return NextResponse.json({ msg: "Response is not ok" });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Something went wrong" });
  }
}

// -------------------- POST --------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, data } = await backend("/api/v1/provider/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}

// -------------------- PATCH --------------------
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { ok, data } = await backend(
      `/api/v1/provider/business`,
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

// -------------------- DELETE --------------------
export async function DELETE(req: Request) {
  try {

    const { ok, data } = await backend(
      `/api/v1/provider/business`,
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