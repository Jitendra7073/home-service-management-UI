import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value || null;
}

export async function getUserByToken(token: string) {
  if (!token) {
    return { user: null, error: "No token provided" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/me/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const userData = await response.json();

    // Check if response indicates an error
    if (!response.ok || userData.error || !userData.success) {
      return { 
        user: null, 
        error: userData.message || "Token validation failed" 
      };
    }

    return userData;
  } catch (error) {
    console.error("getUserByToken error:", error);
    return { 
      user: null, 
      error: "Failed to validate token" 
    };
  }
}
