import { backend } from "@/lib/backend";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ staffId: string }> },
) {
    try {
        const { staffId } = await params;
        const body = await request.json();
        const { ok, data, status } = await backend(
            `/api/v1/provider/staff/${staffId}/unlink`,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!ok) {
            return NextResponse.json(
                {
                    success: false,
                    msg: data?.msg || "Failed to unlink staff",
                },
                { status: status || 500 },
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error unlinking staff:", error);
        return NextResponse.json(
            { success: false, msg: "Internal Server Error" },
            { status: 500 },
        );
    }
}
