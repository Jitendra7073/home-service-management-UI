import { backend } from "@/lib/backend";
import { getAuthToken } from "@/lib/get-token";
import { NextResponse } from "next/server";

export async function GET() {
  const { ok, data, status } = await backend("/api/v1/profile", {
    method: "GET",
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status }
    );
  }
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "User ID required" },
        { status: 400 }
      );
    }

    const { ok, data, status } = await backend(`/api/v1/profile/${id}`, {
      method: "DELETE",
    });

    const res = NextResponse.json(
      { message: "Profile Deleted Successfully" },
      { status: ok ? 200 : status }
    );

    res.cookies.set("token", "", {
      httpOnly: false,
      // secure: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch (err) {

    return NextResponse.json(
      { success: false, msg: "Something went wrong" },
      { status: 500 }
    );
  }
}
