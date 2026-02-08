import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { ok, data } = await backend("/api/v1/provider/booking", {
            method: "GET",
        });
        console.log("Details of Data:", data)

        if (!ok) return NextResponse.json({ msg: "Response is not ok" });

        return NextResponse.json(data?.bookings || []);
    } catch (error) {
        return NextResponse.json({ msg: "Something went wrong" });
    }
}


export async function PATCH(
    req: Request,
) {
    try {
        const { bookingId, status } = await req.json();


        const { ok, data } = await backend(
            `/api/v1/provider/booking/${bookingId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            }
        );

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}