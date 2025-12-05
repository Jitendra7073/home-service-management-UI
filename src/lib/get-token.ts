import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export async function getUserByToken(token: string) {
  if (token !== null) {
    const user = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/me/${token}`,
      {
        method: "GET",
      }
    );
    const userData = await user.json();
    return userData;
  }
}
