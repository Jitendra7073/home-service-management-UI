"use client";

import * as React from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  BarChart,
  PanelsTopLeft,
  HandCoins,
  Building2,
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
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { profileUpgradedTag } from "@/global-states/state";

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
      title: "Manage Business",
      url: "/provider/dashboard/business",
      icon: Building2,
    },
   
    {
      title: "Services",
      url: "/provider/dashboard/services",
      icon: BarChart,
    },
    {
      title: "Pricing",
      url: "/provider/dashboard/pricing",
      icon: HandCoins,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data:UserData, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile", {
        method: "GET",
      });
      const data = await res.json();
      return data;
    },
    staleTime: 5 * 60 * 60 * 1000,
  });
  const user = UserData?.user ?? [];
  const subscriptionStatus = user?.providerSubscription !== null ? user?.providerSubscription?.plan.name.toLowerCase() : "free"

  const LogoutHandler = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    }
    return data;
  };
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
        <NavMain items={data.navMain} subscriptionStatus={subscriptionStatus}/>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} logoutHandle={LogoutHandler} subscriptionStatus ={subscriptionStatus}/>
      </SidebarFooter>
    </Sidebar>
  );
}
