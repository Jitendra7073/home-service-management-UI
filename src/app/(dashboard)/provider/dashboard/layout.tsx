import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/provider/sidePenal/page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full transition-all duration-300">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
