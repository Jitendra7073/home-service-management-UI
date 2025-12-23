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
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    
    return NextResponse.json({ msg: "Server error in route" }, { status: 500 });
  }
}

export async function DELETE(req:Request) {
  const addressId = await req.json();
  try {
    const { ok, data } = await backend(`/api/v1/address/${addressId}`, {
      method: "DELETE",
    });
    if (!ok) {
      return NextResponse.json({ msg: "Address can not be deleted" });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ err });
  }
}
