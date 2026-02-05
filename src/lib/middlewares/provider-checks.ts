// provider-checks.ts
import { NextRequest } from "next/server";

async function fetchJSON(req: NextRequest, endpoint: string) {
  try {
    const baseUrl = req.nextUrl.origin;

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const data = await res.json();
    return data || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function getProviderAddress(req: NextRequest) {
  const res = await fetchJSON(req, "/api/common/address");
  return res?.addresses ?? null;
}

export async function getProviderBusiness(req: NextRequest) {
  const res = await fetchJSON(req, "/api/provider/business");
  return res?.business ?? null;
}

export async function getProviderSlots(req: NextRequest) {
  const res = await fetchJSON(req, "/api/provider/slots");
  return Array.isArray(res?.slots) ? res.slots : null;
}
