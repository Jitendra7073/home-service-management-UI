import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { serviceId: string } }) {
    const data = await params;
    console.log("service Id:", data)
    try {
        const { ok, data } = await backend(`/api/v1/provider/service/${params.serviceId}`, {
            method: "GET",
        });

        if (!ok) return NextResponse.json({ msg: "Response is not ok" });

        return NextResponse.json(data?.bookings || []);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Something went wrong" });
    }
}