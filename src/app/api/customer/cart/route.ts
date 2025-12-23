import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { ok, data } = await backend("/api/v1/customer/cart", {
      method: "GET",
    });

    if (!ok) {
      return NextResponse.json({ error: "Something went wrong" });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {
  const slotData = await req.json();

  const { ok, data } = await backend("/api/v1/customer/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slotData),
  });

  if (!ok) {
    return NextResponse.json({
      data,
      error: data.message || "Internal Server Error",
    });
  }

  return NextResponse.json(
    { message: "Booking created successfully", data },
    { status: 201 }
  );
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const res = await backend("/api/v1/customer/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: body.cartId }),
    });

    return NextResponse.json({ status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
