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
    console.error("Error during fetching", error);

    return NextResponse.json(
      { msg: "Unable to fetch feedback." },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { rating, comment, serviceId} = body;

    if (!rating || !comment || !serviceId) {
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
        serviceId,
      }),
    });

    if (!ok) {
      return NextResponse.json(
        { msg: data?.msg || "Something went wrong" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GiveFeedback API Error:", error);

    return NextResponse.json(
      { msg: "Unable to create feedback." },
      { status: 500 }
    );
  }
}
