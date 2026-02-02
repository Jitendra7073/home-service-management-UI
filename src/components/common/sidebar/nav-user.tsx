"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut, EllipsisVertical, BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export type UserMenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  subscriptionStatus?: string;
  logoutHandle: () => void;
  menuItems?: UserMenuItem[];
}

export function NavUser({
  user,
  subscriptionStatus,
  logoutHandle,
  menuItems = [],
}: NavUserProps) {
  const { isMobile } = useSidebar();

  const isPaidPlan =
    subscriptionStatus &&
    subscriptionStatus !== "free" &&
    subscriptionStatus !== "none";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-md grayscale">
                <AvatarImage
                  src={
                    user.avatar ||
                    "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                  }
                  alt={user.name}
                />
                <AvatarFallback className="rounded-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex justify-between">
                  <span className="truncate font-medium">
                    {user.name || "Use"}
                  </span>
                </div>

                <span className="text-muted-foreground truncate text-xs">
                  {user.email || ""}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              {subscriptionStatus && (
                <div className="px-2 py-1.5">
                  <Badge
                    variant="outline"
                    className={`flex items-center w-fit gap-1.5 px-2.5 py-1 text-xs font-medium ${
                      isPaidPlan
                        ? "text-yellow-600 border-yellow-600 bg-yellow-50"
                        : "text-gray-600 border-gray-200"
                    }`}>
                    {isPaidPlan && <BadgeCheckIcon className="h-3.5 w-3.5" />}
                    {subscriptionStatus === "free" || !subscriptionStatus
                      ? "Free Plan"
                      : subscriptionStatus}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-md grayscale">
                  <AvatarImage
                    src={
                      user.avatar ||
                      "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                    }
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            {menuItems.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <DropdownMenuItem>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logoutHandle}
              className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
