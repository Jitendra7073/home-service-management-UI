"use client";

import * as React from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  BarChart,
  PanelsTopLeft,
  HandCoins,
  Building2,
  TicketCheck,
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
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
      title: "Bookings",
      url: "/provider/dashboard/bookings",
      icon: TicketCheck,
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
      window.location.reload();
    }
    return data;
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent data-[state=open]:hover:bg-transparent hover:bg-gray-100 w-full">
              <Link
                href="/provider/dashboard"
                className="flex justify-center items-center gap-2 w-full">
                <div className="flex aspect-squar items-center justify-center rounded-md ">
                  <Image
                    src="/HSM-logo.png"
                    alt="Homhelpers"
                    width={140}
                    height={70}
                    className="object-contain"
                  />
                </div>
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
      <SidebarRail />
    </Sidebar>
  );
}
