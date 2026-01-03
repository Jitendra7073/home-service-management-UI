import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await params;

        if (!bookingId) {
            return NextResponse.json(
                { success: false, error: "Booking ID is required" },
                { status: 400 }
            );
        }

        const { ok, data, status } = await backend(
            `/api/v1/customer/bookings/${bookingId}/cancellation`,
            {
                method: "GET",
            }
        );

        if (!ok) {
            return NextResponse.json(
                {
                    success: false,
                    error: data?.msg || "Failed to fetch cancellation details",
                },
                { status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("Fetch cancellation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
