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
import NotificationSideBar from "@/components/common/notification-sidebar";
import Image from "next/image";

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
  const {
    data: UserData,
    isLoading,
    isPending,
    isError,
    error,
  } = useQuery({
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
  const subscriptionStatus =
    user?.providerSubscription !== null
      ? user?.providerSubscription?.plan.name.toLowerCase()
      : "free";

  const LogoutHandler = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      // Clear stored tokens (now handled by httpOnly cookies)
      // No need to manually clear localStorage
      window.location.reload();
    }
    return data;
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-5 mt-3 hover:bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/provider/dashboard" className="flex justify-center items-center relative">
                <Image
                  src="/HSM-logo.png"
                  alt="ServiceHub Logo"
                  width={140}
                  height={70}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-3 text-xs font-semibold text-slate-600">(Provider)</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} subscriptionStatus={subscriptionStatus} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={user}
          logoutHandle={LogoutHandler}
          subscriptionStatus={subscriptionStatus}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
