"use client";

import NotificationSideBar from "@/components/common/notification-sidebar";
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
import {
  Bell,
  CreditCard,
  LogOut,
  User,
  EllipsisVertical,
  BadgeCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavUser({
  user,
  subscriptionStatus,
  logoutHandle,
}: {
  user: any;
  subscriptionStatus: string;
  logoutHandle: () => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src="https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex justify-between">
                  <span className="truncate font-medium">
                    {user.name || "fetching..."}
                  </span>
                </div>

                <span className="text-muted-foreground truncate text-xs">
                  {user.email || "fetching..."}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <Badge
                className={`flex items-center w-full gap-1.5 border px-2.5 py-1 text-xs font-medium ${
                  subscriptionStatus !== "free" &&
                  "text-yellow-600 bg-transparent border border-yellow-600"
                }`}>
                {subscriptionStatus !== "free" && (
                  <BadgeCheckIcon className="h-3.5 w-3.5" />
                )}
                {subscriptionStatus}
              </Badge>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name || "fetching..."}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email || "fetching..."}
                  </span>
                </div>
              </div>
              
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/provider/dashboard/profile">
                <DropdownMenuItem>
                  <User />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link href="/provider/dashboard/pricing">
                <DropdownMenuItem>
                  <CreditCard />
                  Pricing
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-center">
                  <ThemeToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutHandle()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
