import { backend } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    // First get provider's business profile
    const { ok: businessOk, data: businessData } = await backend(
      "/api/v1/provider/business",
      {
        method: "GET",
      },
    );

    console.log("Business Details under the staff leave route:", businessData);

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

    // Get all leave requests for this business with status filter
    const { ok, data } = await backend(
      `/api/v1/provider/staff/leave/${businessProfileId}/requests?status=${status}`,
      {
        method: "GET",
      },
    );

    if (!ok) {
      return NextResponse.json(
        { success: false, msg: "Failed to fetch leave requests" },
        { status: 500 },
      );
    }

    const leaveRequests = data?.leaveRequests || [];

    // Count pending leaves (from all leaves, not filtered)
    let pendingCount = 0;

    // If viewing ALL or APPROVED or REJECTED, we need to fetch pending count separately
    if (status !== "PENDING") {
      const { ok: pendingOk, data: pendingData } = await backend(
        `/api/v1/provider/staff/leave/${businessProfileId}/requests?status=PENDING`,
        {
          method: "GET",
        },
      );
      if (pendingOk && pendingData?.leaveRequests) {
        pendingCount = pendingData.leaveRequests.length;
      }
    } else {
      pendingCount = leaveRequests.length;
    }

    // Get total count by fetching ALL leaves
    let totalCount = leaveRequests.length;
    if (status !== "ALL") {
      const { ok: allOk, data: allData } = await backend(
        `/api/v1/provider/staff/leave/${businessProfileId}/requests?status=ALL`,
        {
          method: "GET",
        },
      );
      if (allOk && allData?.leaveRequests) {
        totalCount = allData.leaveRequests.length;
      }
    }

    return NextResponse.json({
      success: true,
      leaveRequests: leaveRequests,
      pendingCount,
      totalCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 },
    );
  }
}
