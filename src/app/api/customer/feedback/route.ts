import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";


export async function GET(){
  try {
    const {ok,data} = await backend("/api/v1/customer/all-feedback",{
      method:"GET"
    })
    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { msg: "Unable to fetch feedback." },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body",body)

    const { rating, comment, bookingId} = body;
    console.log(`Rating: ${rating}, comment: ${comment}, bookingId: ${bookingId}`)

    if (!rating || !comment || !bookingId) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    const { ok, data } = await backend("/api/v1/customer/give-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        comment,
        bookingId,
      }),
    });
    console.log("Data",data)

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { msg: "Unable to create feedback." },
      { status: 500 }
    );
  }
}
