import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/provider/sidePenal/page";
import ServiceAwarenessModal from "@/components/provider/pop-up-model/service-model";
import AddServiceModal from "@/components/provider/services/create/AddServiceModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full transition-all duration-300">
        <SidebarTrigger />
        {children}
        <ServiceAwarenessModal />
        <AddServiceModal />
      </main>
    </SidebarProvider>
  );
}
