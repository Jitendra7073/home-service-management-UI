"use client";

import TanstackProvider from "@/app/tanstackProvider";
import { AdminLayoutContent } from "@/components/admin/layout/AdminLayoutContent";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </TanstackProvider>
  );
}
