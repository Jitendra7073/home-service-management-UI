import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { ok, data } = await backend('/api/v1/provider/dashboard/stats', {
            method: 'GET',
        });
        if (!ok) return NextResponse.json({ msg: "Response is not ok" });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch dashboard stats', status: 500 });
    }
}