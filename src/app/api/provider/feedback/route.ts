import { backend } from "@/lib/backend"
import { NextResponse } from "next/server"
import { toast } from "sonner"

export async function GET() {
    try {
        const { ok, data } = await backend("/api/v1/provider/service-feedback", {
            method: "GET",
        })
        if (ok) {
            return NextResponse.json(data, {
                status: 200,
            })
        }
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500,
        })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error (GET)" }, {
            status: 500,
        })

    }
}

export async function PATCH(req: Request) {
    try {
        const { feedbackId } = await req.json();

        if (!feedbackId) {
            return NextResponse.json(
                { msg: "feedbackId is required" },
                { status: 400 }
            );
        }

        const { ok, data } = await backend(
            `/api/v1/provider/service-feedback/${feedbackId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!ok) {
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

        return NextResponse.json(
            { msg: "Feedback status updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { msg: "Internal Server Error" },
            { status: 500 }
        );
    }
}