import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {token} = await req.json();
  try {
    const { ok, data } = await backend(`/api/v1/notification/store-fcm-token`, {
      method: "POST",
      headers: {
          "x-fcm-token": token, 
        },
    });
    if (!ok) {
      return NextResponse.json(data)
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      msg: "Error During storing fcm token!",
    });
  }
}
