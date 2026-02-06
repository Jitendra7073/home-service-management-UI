import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ staffId: string }> },
) {
  const { staffId } = await params;

  try {
    // First get provider's business profile
    const { ok: businessOk, data: businessData } = await backend("/api/v1/business/my-business", {
      method: "GET",
    });

    if (!businessOk || !businessData?.success) {
      return NextResponse.json(
        { success: false, msg: "Failed to fetch business profile" },
        { status: 500 },
      );
    }

    const businessProfileId = businessData.business?.id;

    if (!businessProfileId) {
      return NextResponse.json(
        { success: false, msg: "Business profile not found" },
        { status: 404 },
      );
    }

    // Get ALL leave requests for this business (pending, approved, rejected)
    const { ok, data } = await backend(
      `/api/v1/provider/staff/leave/${businessProfileId}/requests?status=ALL`,
      {
        method: "GET",
      }
    );

    if (!ok) {
      return NextResponse.json(
        { message: data?.msg || "Failed to fetch staff leaves" },
        { status: 500 },
      );
    }

    // Filter leaves for this specific staff
    const staffLeaves = data?.leaveRequests?.filter(
      (leave: any) => leave.staffId === staffId
    ) || [];

    return NextResponse.json({
      success: true,
      leaves: staffLeaves,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
