export async function backend(path: string, options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  return { status: res.status, ok: res.ok, data };
}
