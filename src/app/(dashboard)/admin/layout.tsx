"use client";

import TanstackProvider from "@/app/tanstackProvider";
import { AdminLayoutContent } from "@/components/admin/layout/AdminLayoutContent";
import { AdminNoIndex } from "@/components/seo/NoIndexHead";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SEO: Prevent search engines from indexing admin pages */}
      <AdminNoIndex />

      <TanstackProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </TanstackProvider>
    </>
  );
}
