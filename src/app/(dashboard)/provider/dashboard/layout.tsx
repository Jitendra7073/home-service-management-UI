import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/provider/sidePenal/page";

export default function DashboardLayout({
  welcome,
  quickCounts,
  charts,
  bookings,
  services,
  feedbacks
}: {
  welcome: React.ReactNode;
  quickCounts: React.ReactNode;
  charts: React.ReactNode;
  bookings: React.ReactNode;
  services: React.ReactNode;
  feedbacks: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full transition-all duration-300">
        <SidebarTrigger />

        <div className="max-w-[1400px] mx-auto space-y-6">
          {welcome}

          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickCounts}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {charts}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {services}
            {feedbacks}
          </div>

          <div>{bookings}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
