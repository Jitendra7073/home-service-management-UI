import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/provider/sidePenal/page";
import ServiceAwarenessModal from "@/components/provider/pop-up-model/service-model";
import AddServiceModal from "@/components/provider/services/create/AddServiceModal";
import NotificationSideBar from "@/components/common/notification-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="relative w-full transition-all duration-300">
        <SidebarTrigger />
        {children}
        <ServiceAwarenessModal />
        <AddServiceModal />
        <div className="absolute top-4 right-4 rounded-sm text-white">
          <NotificationSideBar/>
        </div>
      </main>
    </SidebarProvider>
  );
}
