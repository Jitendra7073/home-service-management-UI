"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  List,
  LogOut,
  LayoutList,
  BadgeIndianRupee,
  CreditCard,
  ChartPie,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/use-queries";
import Image from "next/image";
import NotificationSideBar from "@/components/common/notification-sidebar";

export function AdminLayoutContent({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: user } = useUserProfile();
  const userDetails = user?.user || [];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/businesses",
      label: "Businesses",
      icon: Building2,
    },
    {
      href: "/admin/services",
      label: "Services",
      icon: List,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: LayoutList,
    },
    {
      href: "/admin/plans",
      label: "Plans",
      icon: BadgeIndianRupee,
    },
    {
      href: "/admin/subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
    },
    {
      href: "/admin/revenue",
      label: "Financials",
      icon: ChartPie,
    },
    {
      href: "/admin/legal",
      label: "Legal Docs",
      icon: List,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const userName = userDetails ? userDetails.name || "Admin" : "Admin";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="h-16 border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-transparent data-[state=open]:hover:bg-transparent ">
                <Link
                  href="/admin"
                  className="flex justify-center items-center">
                  <div className="flex aspect-squar items-center justify-center rounded-sm w-full hover:bg-gray-100">
                    <Image
                      src="/HSM-logo.png"
                      alt="ServiceHub Logo"
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
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} HomHelpers Admin
          </p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-semibold text-foreground">
              {navItems.find((item) => isActive(item.href))?.label ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Sidebar */}
            <NotificationSideBar />

            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">
                Administrator
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 bg-gray-100 cursor-pointer rounded-sm border border-slate-200">
                  <span className="font-semibold text-slate-700">
                    {userDetails &&
                      userDetails?.name
                        ?.split(" ")
                        .map((item: any) => item.charAt(0).toUpperCase())
                        .join("")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userDetails?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto py-10 ">
          <div className="px-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
