"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  ListChecks,
  BarChart,
  Folder,
  Users,
  PanelsTopLeft,
} from "lucide-react";

import { NavMain } from "@/components/provider/dashboard/nav-main";
import { NavUser } from "@/components/provider/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sidebar links
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/images/p/default-profile-picture.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/provider/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings",
      url: "/provider/dashboard/bookings",
      icon: ListChecks,
    },
    {
      title: "Services",
      url: "/provider/dashboard/services",
      icon: BarChart,
    },
    {
      title: "Notification",
      url: "/provider/dashboard/notification",
      icon: Folder,
    },
    {
      title: "Team",
      url: "/provider/dashboard/our-team",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // ← CURRENT ROUTE

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/provider/dashboard">
                <PanelsTopLeft className="!size-5" />
                <span className="text-base font-semibold">PROVIDER</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} activePath={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
