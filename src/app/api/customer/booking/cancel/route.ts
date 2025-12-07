import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";


export async function PATCH(req: Request) {
    try {
        const { bookingId } = await req.json();

        console.log("Cancel request for booking ID (route):", bookingId);

        if (!bookingId) {
            return NextResponse.json(
                { error: "Booking ID is required" },
                { status: 400 }
            );
        }

        // 🔥 Call backend cancel API
        const { ok, data } = await backend(
            `/api/v1/customer/bookings/${bookingId}/cancel`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}), // no reason yet
            }
        );
        console.log("Backend cancel response:", data);

        if (!ok) {
            return NextResponse.json(
                { error: data || "Cancellation failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Booking cancelled successfully", data },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}