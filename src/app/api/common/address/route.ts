import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/address", {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json({
        msg: "response not ok ",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await backend("/api/v1/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const { ok, data } = response;

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json(
        { success: false, msg: "Address ID is required" },
        { status: 400 },
      );
    }

    const { ok, data } = await backend(`/api/v1/address/${addressId}`, {
      method: "DELETE",
    });

    if (!ok) {
      return NextResponse.json(
        data || { success: false, msg: "Unable to delete this address!" },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Delete address error:", err);
    return NextResponse.json(
      { success: false, msg: "Server error" },
      { status: 500 },
    );
  }
}
