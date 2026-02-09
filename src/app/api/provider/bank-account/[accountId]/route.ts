import { backend } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ accountId: string }> },
) {
  const params = await props.params;
  const { accountId } = params;

  try {
    const { ok, data, status } = await backend(
      `/api/v1/provider/bank-account/${accountId}`,
      {
        method: "DELETE",
      },
    );

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Failed to delete bank account",
      },
      { status: 500 },
    );
  }
}
