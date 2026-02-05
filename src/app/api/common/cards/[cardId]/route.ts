import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

// -------------------- PUT (Update Card) --------------------
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    const { cardId } = await params;
    const body = await req.json();

    const { ok, data } = await backend(`/api/v1/cards/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to update card" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 },
    );
  }
}

// -------------------- PATCH (Set Default Card) --------------------
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    const { cardId } = await params;

    const { ok, data } = await backend(`/api/v1/cards/${cardId}/default`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to set default card" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 },
    );
  }
}

// -------------------- DELETE (Delete Card) --------------------
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    const { cardId } = await params;

    const { ok, data } = await backend(`/api/v1/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: data?.msg || "Failed to delete card" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 },
    );
  }
}
