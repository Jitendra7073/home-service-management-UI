"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavItem = {
  title: string;
  url: string;
  icon?: ComponentType<{ className?: string }>;
};

type NavMainProps = {
  items: NavItem[];
  subscriptionStatus?: string;
};

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isItemActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map(({ title, url, icon: Icon }) => {
            const active = isItemActive(url);

            return (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  asChild
                  tooltip={title}
                  className={cn(
                    "transition-colors",
                    active
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}>
                  <Link href={url} aria-current={active ? "page" : undefined}>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
