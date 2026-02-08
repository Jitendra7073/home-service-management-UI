import { backend } from "@/lib/backend";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ staffId: string }> },
) {
    try {
        const { staffId } = await params;
        const { ok, data, status } = await backend(
            `/api/v1/provider/staff/${staffId}/bookings`,
            {
                method: "GET",
            },
        );

        if (!ok) {
            return NextResponse.json(
                {
                    success: false,
                    msg: data?.msg || "Failed to fetch staff bookings",
                },
                { status: status || 500 },
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching staff bookings:", error);
        return NextResponse.json(
            { success: false, msg: "Internal Server Error" },
            { status: 500 },
        );
    }
}
