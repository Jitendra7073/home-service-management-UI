import { cookies } from "next/headers";

export async function backend(path: string, options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  return { status: res.status, ok: res.ok, data, headers: res.headers };
}
