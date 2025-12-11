import { NextRequest } from "next/server";

// Address check
export async function getProviderAddress(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;

    const res = await fetch(`${baseUrl}/api/provider/address`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Address fetch error:", error);
    return null;
  }
}

// Business check
export async function getProviderBusiness(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;

    const res = await fetch(`${baseUrl}/api/provider/business`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Business fetch error:", error);
    return null;
  }
}

// Slots check
export async function getProviderSlots(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;

    const res = await fetch(`${baseUrl}/api/provider/slots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Slots fetch error:", error);
    return null;
  }
}
