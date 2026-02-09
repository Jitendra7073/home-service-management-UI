import type { Metadata } from "next";
import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/staff/sidebar";
import NotificationSideBar from "@/components/common/notification-sidebar";

export const metadata: Metadata = {
  title: "Staff Portal - Manage Your Assignments",
  description:
    "Staff portal for managing assignments, viewing earnings, and updating availability.",
  keywords: [
    "staff portal",
    "staff assignments",
    "staff earnings",
    "service staff management",
  ],
  robots: {
    index: false, // Prevent indexing
    follow: false, // Prevent following
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

import AuthGuard from "@/components/common/AuthGuard";

function StaffLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="staff">
      <SidebarProvider>
        <StaffSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="pr-4">
              <NotificationSideBar />
            </div>
          </header>

          <GetFcmToken />
          <FirebaseForegroundListener />
          <main className="flex-1 space-y-4 p-4 pt-0 my-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StaffLayoutContent>{children}</StaffLayoutContent>;
}
