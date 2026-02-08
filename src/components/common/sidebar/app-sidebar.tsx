"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

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

import { NavMain, NavItem } from "./nav-main";
import { NavUser, UserMenuItem } from "./nav-user";

export type SidebarUserData = {
  name: string;
  email: string;
  avatar?: string;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SidebarUserData;
  navItems: NavItem[];
  userMenuItems?: UserMenuItem[];
  subscriptionStatus?: string;
  logoutHandler: () => void;
  logoUrl?: string;
  homeLink?: string;
}

export function AppSidebar({
  user,
  navItems,
  userMenuItems,
  subscriptionStatus,
  logoutHandler,
  logoUrl = "/HSM-logo.png",
  homeLink = "/",
  ...props
}: AppSidebarProps) {
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
                href={homeLink}
                className="flex justify-center items-center gap-2 w-full">
                <div className="flex aspect-square items-center justify-center rounded-sm">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={140}
                    height={70}
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} subscriptionStatus={subscriptionStatus} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={user}
          logoutHandle={logoutHandler}
          subscriptionStatus={subscriptionStatus}
          menuItems={userMenuItems}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
