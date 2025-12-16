"use client";

import * as React from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  ListChecks,
  BarChart,
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/provider/dashboard">
                <PanelsTopLeft className="!size-5" />
                <span className="text-base font-semibold">PROVIDER</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
