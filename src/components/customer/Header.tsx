"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  User2,
  Bell,
  Calendar,
  Search,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import NotificationSideBar from "../common/notification-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const closeSheet = () => setOpen(false);

  const menuItems = [
    {
      title: "Home",
      href: "/customer",
      icon: Home,
    },
    {
      title: "Explore",
      href: "/customer/explore",
      icon: Search,
    },
    {
      title: "Booking",
      href: "/customer/booking",
      icon: Calendar,
    },
    {
      title: "Cart",
      href: "/customer/cart",
      icon: ShoppingCart,
    },
    {
      title: "Profile",
      href: "/customer/profile",
      icon: User2,
    },
  ];

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link
          href="/customer"
          className="text-2xl font-bold tracking-wide text-primary shrink-0">
          HSM
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}>
                    <Link
                      href={item.href}
                      className="text-sm flex items-center gap-1">
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NotificationSideBar />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                {open ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </SheetTrigger>

            {/* MOBILE MENU CONTENT */}
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <Link
                  href="/customer"
                  onClick={closeSheet}
                  className="text-xl font-bold text-primary">
                  HSM
                </Link>
              </div>

              <ScrollArea className="h-[calc(100vh-73px)]">
                <div className="px-4 py-4 space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSheet}
                      className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                      <item.icon size={20} className="text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}

                  <Link
                    href="#"
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                    <Bell size={20} className="text-primary" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
