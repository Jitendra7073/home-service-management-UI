import { cookies } from "next/headers";

export async function backend(path: string, options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c: any) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(url, {
    ...options,
    headers: {
      Cookie: cookieString,
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    status: res.status,
    ok: res.ok,
    data,
    headers: res.headers,
  };
}
