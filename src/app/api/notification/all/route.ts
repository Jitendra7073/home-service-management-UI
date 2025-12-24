import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

/* ---------------- RECEIVED All NOTIFICATIONS ---------------- */
export async function GET() {
    try {
        const { ok, data } = await backend("/api/v1/notification/all", {
            method: "GET"
        });
        if (!ok) {
            return NextResponse.json({ msg: "Failed to fetch notifications!" })
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            msg: "Error During fetching notifications!",
        });
    }
}

/* ---------------- CUSTOMER UPDATE NOTIFICATIONS STATUS ---------------- */
export async function PATCH(req:Request){
    const {notificationId} = await req.json();
    try {
        const {ok, data} = await backend(`/api/v1/notification/read/${notificationId}`,{
            method:"PATCH",
        })
        if(!ok){
            return NextResponse.json({
                msg:"Something went wrong"
            })
        }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            msg:"Error to updating the status"
        })
    }
}