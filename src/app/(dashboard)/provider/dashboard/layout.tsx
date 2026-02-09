import { Metadata } from "next";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/provider/sidePenal/page";
import ServiceAwarenessModal from "@/components/provider/pop-up-model/service-model";
import AddServiceModal from "@/components/provider/services/create/AddServiceModal";
import NotificationSideBar from "@/components/common/notification-sidebar";
import { DashboardNoIndex } from "@/components/seo/NoIndexHead";

// SEO: Prevent indexing of provider dashboard pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SEO: Prevent search engines from indexing provider dashboard */}
      <DashboardNoIndex />

      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className=" pr-4">
              <NotificationSideBar />
            </div>
          </header>
          <div className="flex-1 space-y-4 p-4 pt-0 my-6">{children}</div>
          <ServiceAwarenessModal />
          <AddServiceModal />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
