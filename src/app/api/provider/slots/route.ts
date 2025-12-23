import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/provider/slots", {
      method: "GET",
    });

    if (!ok) return NextResponse.json(data);

    return NextResponse.json(data);
  } catch (error) {
    
    return NextResponse.json({ msg: "Something went wrong" });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ok, data } = await backend("/api/v1/provider/slots", {
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
    
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}


// -------------------- DELETE --------------------
export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {

    const { ok, data } = await backend(
      `/api/v1/provider/slot/${id}`,
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
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}