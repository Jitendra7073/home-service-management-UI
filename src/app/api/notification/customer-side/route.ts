import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

/* ---------------- CUSTOMER RECEIVED NOTIFICATIONS ---------------- */
export async function GET() {
    try {
        const { ok, data } = await backend("/api/v1/customer/notifications", {
            method: "GET"
        });
        if (!ok) {
            return NextResponse.json({ msg: "Failed to fetch notifications!" })
        }
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({
            msg: "Error During fetching notifications!",
        });
    }
}